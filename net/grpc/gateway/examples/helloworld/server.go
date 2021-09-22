package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"time"
	"errors"

	pb "./snapchat_gateway"
	"google.golang.org/grpc"
)

const (
	// Must match what envoy load balancer forwards to
	port = ":9090"
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGatewayServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("in SayHello: %v", in)
	return &pb.HelloReply{Message: "Hello from golang " + in.GetName()}, nil
}

func (s *server) SayRepeatHello(in *pb.RepeatHelloRequest, stream pb.Gateway_SayRepeatHelloServer) error {
	log.Printf("in SayRepeatHello: %v", in)
	for i := int32(1); i <= in.GetCount(); i++ {
		reply := &pb.HelloReply{Message: fmt.Sprintf("Hello from golang %s %d", in.GetName(), i)}
		if err := stream.Send(reply); err != nil {
			return err
		}
		time.Sleep(1 * time.Second)
	}

	return nil
}

func replyToConnect(in *pb.Message, stream pb.Gateway_ConnectServer) error {
	log.Printf("in Connect - got request: %v", in)
	for i := int32(1); i <= 5; i++ {
		log.Printf("in Connect - replying: %d", i)
		reply := &pb.Message{Path: fmt.Sprintf("Hello from golang %s %d", in.GetPath(), i)}
		if err := stream.Send(reply); err != nil {
			log.Printf("in Connect - error replying: %v", err)
			return err
		}
		time.Sleep(1 * time.Second)
	}

	log.Print("in Connect - done all replies")
	return nil
}

// impl without goroutines
// remove underscore to make this impl active
func (s *server) _Connect(stream pb.Gateway_ConnectServer) error {
	log.Print("in Connect")
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			log.Print("in Connect - stream done")
			return nil
		}
		if err != nil {
			log.Printf("in Connect - error: %v", err)
			return err
		}

		// If we reply on this goroutine, even though there is an EOF waiting in the stream,
		// we keep it open until we are done sending our replies up.
		err = replyToConnect(in, stream)
		if err != nil {
			return err
		}

		// If we do this, the client gets an end of stream 200 right away, and the server
		// fails with an error from stream.Send(), saying context canceled
		// go replyToConnect(in, stream)
	}
}

func (s *server) Connect(stream pb.Gateway_ConnectServer) error {
	log.Print("in Connect")
	streamErrChan := make(chan error)
	go func() {
		for {
			in, err := stream.Recv()
			if err != nil && err != io.EOF {
				log.Printf("in Connect - error in stream: %v", err)
				streamErrChan <- err
				return
			}

			if err == io.EOF {
				// No need to busy-wait on EOF, just kill this goroutine, and
				// let the request handler goroutine wait on the done channel.
				log.Printf("Got EOF, exiting goroutine")
				return
			}

			err = replyToConnect(in, stream)
			if err != nil {
				streamErrChan <- err
				return
			}
		}
	}()

	select {
	case streamErr := <-streamErrChan:
		log.Printf("About to close Connect from server side, with error: %v", streamErr)
		return streamErr
	case <-stream.Context().Done():
		log.Printf("Closing stream, server context is done")
		return errors.New("server context is done")
	}
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGatewayServer(s, &server{})
	log.Printf("golang server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
