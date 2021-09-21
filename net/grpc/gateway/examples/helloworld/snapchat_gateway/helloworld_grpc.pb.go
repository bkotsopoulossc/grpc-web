// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.1.0
// - protoc             v3.17.3
// source: helloworld.proto

package snapchat_gateway

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// GatewayClient is the client API for Gateway service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type GatewayClient interface {
	// unary call
	SayHello(ctx context.Context, in *HelloRequest, opts ...grpc.CallOption) (*HelloReply, error)
	// server streaming call
	SayRepeatHello(ctx context.Context, in *RepeatHelloRequest, opts ...grpc.CallOption) (Gateway_SayRepeatHelloClient, error)
	// Note. The JS client uses the codegen, the server uses reflection. So save this
	// with bidi so the server uses it, but generate the codegen with SSS and check in
	// so the client codegen works.
	Connect(ctx context.Context, opts ...grpc.CallOption) (Gateway_ConnectClient, error)
}

type gatewayClient struct {
	cc grpc.ClientConnInterface
}

func NewGatewayClient(cc grpc.ClientConnInterface) GatewayClient {
	return &gatewayClient{cc}
}

func (c *gatewayClient) SayHello(ctx context.Context, in *HelloRequest, opts ...grpc.CallOption) (*HelloReply, error) {
	out := new(HelloReply)
	err := c.cc.Invoke(ctx, "/snapchat.gateway.Gateway/SayHello", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gatewayClient) SayRepeatHello(ctx context.Context, in *RepeatHelloRequest, opts ...grpc.CallOption) (Gateway_SayRepeatHelloClient, error) {
	stream, err := c.cc.NewStream(ctx, &Gateway_ServiceDesc.Streams[0], "/snapchat.gateway.Gateway/SayRepeatHello", opts...)
	if err != nil {
		return nil, err
	}
	x := &gatewaySayRepeatHelloClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type Gateway_SayRepeatHelloClient interface {
	Recv() (*HelloReply, error)
	grpc.ClientStream
}

type gatewaySayRepeatHelloClient struct {
	grpc.ClientStream
}

func (x *gatewaySayRepeatHelloClient) Recv() (*HelloReply, error) {
	m := new(HelloReply)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (c *gatewayClient) Connect(ctx context.Context, opts ...grpc.CallOption) (Gateway_ConnectClient, error) {
	stream, err := c.cc.NewStream(ctx, &Gateway_ServiceDesc.Streams[1], "/snapchat.gateway.Gateway/Connect", opts...)
	if err != nil {
		return nil, err
	}
	x := &gatewayConnectClient{stream}
	return x, nil
}

type Gateway_ConnectClient interface {
	Send(*Message) error
	Recv() (*Message, error)
	grpc.ClientStream
}

type gatewayConnectClient struct {
	grpc.ClientStream
}

func (x *gatewayConnectClient) Send(m *Message) error {
	return x.ClientStream.SendMsg(m)
}

func (x *gatewayConnectClient) Recv() (*Message, error) {
	m := new(Message)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// GatewayServer is the server API for Gateway service.
// All implementations must embed UnimplementedGatewayServer
// for forward compatibility
type GatewayServer interface {
	// unary call
	SayHello(context.Context, *HelloRequest) (*HelloReply, error)
	// server streaming call
	SayRepeatHello(*RepeatHelloRequest, Gateway_SayRepeatHelloServer) error
	// Note. The JS client uses the codegen, the server uses reflection. So save this
	// with bidi so the server uses it, but generate the codegen with SSS and check in
	// so the client codegen works.
	Connect(Gateway_ConnectServer) error
	mustEmbedUnimplementedGatewayServer()
}

// UnimplementedGatewayServer must be embedded to have forward compatible implementations.
type UnimplementedGatewayServer struct {
}

func (UnimplementedGatewayServer) SayHello(context.Context, *HelloRequest) (*HelloReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SayHello not implemented")
}
func (UnimplementedGatewayServer) SayRepeatHello(*RepeatHelloRequest, Gateway_SayRepeatHelloServer) error {
	return status.Errorf(codes.Unimplemented, "method SayRepeatHello not implemented")
}
func (UnimplementedGatewayServer) Connect(Gateway_ConnectServer) error {
	return status.Errorf(codes.Unimplemented, "method Connect not implemented")
}
func (UnimplementedGatewayServer) mustEmbedUnimplementedGatewayServer() {}

// UnsafeGatewayServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to GatewayServer will
// result in compilation errors.
type UnsafeGatewayServer interface {
	mustEmbedUnimplementedGatewayServer()
}

func RegisterGatewayServer(s grpc.ServiceRegistrar, srv GatewayServer) {
	s.RegisterService(&Gateway_ServiceDesc, srv)
}

func _Gateway_SayHello_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(HelloRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GatewayServer).SayHello(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/snapchat.gateway.Gateway/SayHello",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GatewayServer).SayHello(ctx, req.(*HelloRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Gateway_SayRepeatHello_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(RepeatHelloRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(GatewayServer).SayRepeatHello(m, &gatewaySayRepeatHelloServer{stream})
}

type Gateway_SayRepeatHelloServer interface {
	Send(*HelloReply) error
	grpc.ServerStream
}

type gatewaySayRepeatHelloServer struct {
	grpc.ServerStream
}

func (x *gatewaySayRepeatHelloServer) Send(m *HelloReply) error {
	return x.ServerStream.SendMsg(m)
}

func _Gateway_Connect_Handler(srv interface{}, stream grpc.ServerStream) error {
	return srv.(GatewayServer).Connect(&gatewayConnectServer{stream})
}

type Gateway_ConnectServer interface {
	Send(*Message) error
	Recv() (*Message, error)
	grpc.ServerStream
}

type gatewayConnectServer struct {
	grpc.ServerStream
}

func (x *gatewayConnectServer) Send(m *Message) error {
	return x.ServerStream.SendMsg(m)
}

func (x *gatewayConnectServer) Recv() (*Message, error) {
	m := new(Message)
	if err := x.ServerStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// Gateway_ServiceDesc is the grpc.ServiceDesc for Gateway service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Gateway_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "snapchat.gateway.Gateway",
	HandlerType: (*GatewayServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "SayHello",
			Handler:    _Gateway_SayHello_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "SayRepeatHello",
			Handler:       _Gateway_SayRepeatHello_Handler,
			ServerStreams: true,
		},
		{
			StreamName:    "Connect",
			Handler:       _Gateway_Connect_Handler,
			ServerStreams: true,
			ClientStreams: true,
		},
	},
	Metadata: "helloworld.proto",
}
