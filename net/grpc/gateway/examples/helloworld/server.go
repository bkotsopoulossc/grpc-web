package main

import (
	"context"
	"io"
	"fmt"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	pb "./snapchat_gateway"
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

func replyToConnect(in *pb.Message, stream pb.Gateway_ConnectServer) {
	log.Printf("in Connect - got request: %v", in)
	for i := int32(1); i <= 5; i++ {
		log.Printf("in Connect - replying: %d", i)
		reply := &pb.Message{Path: fmt.Sprintf("Hello from golang %s %d", in.GetPath(), i)}
		if err := stream.Send(reply); err != nil {
			log.Printf("in Connect - error replying: %v", err)
			return
		}
	    time.Sleep(1 * time.Second)
	}

	log.Print("in Connect - done all replies")
}

func (s *server) Connect(stream pb.Gateway_ConnectServer) error {
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

		replyToConnect(in, stream)

		// If we do this, the client gets an end of stream 200 right away, and the server
		// fails with an error from stream.Send(), saying context canceled
		// go replyToConnect(in, stream)
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