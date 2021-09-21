/**
 * @fileoverview gRPC-Web generated client stub for snapchat.gateway
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.snapchat = {};
proto.snapchat.gateway = require('./helloworld_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.snapchat.gateway.GatewayClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.snapchat.gateway.GatewayPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'binary';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.snapchat.gateway.HelloRequest,
 *   !proto.snapchat.gateway.HelloReply>}
 */
const methodDescriptor_Gateway_SayHello = new grpc.web.MethodDescriptor(
  '/snapchat.gateway.Gateway/SayHello',
  grpc.web.MethodType.UNARY,
  proto.snapchat.gateway.HelloRequest,
  proto.snapchat.gateway.HelloReply,
  /**
   * @param {!proto.snapchat.gateway.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.HelloReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.snapchat.gateway.HelloRequest,
 *   !proto.snapchat.gateway.HelloReply>}
 */
const methodInfo_Gateway_SayHello = new grpc.web.AbstractClientBase.MethodInfo(
  proto.snapchat.gateway.HelloReply,
  /**
   * @param {!proto.snapchat.gateway.HelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.HelloReply.deserializeBinary
);


/**
 * @param {!proto.snapchat.gateway.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.snapchat.gateway.HelloReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.snapchat.gateway.HelloReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.snapchat.gateway.GatewayClient.prototype.sayHello =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/snapchat.gateway.Gateway/SayHello',
      request,
      metadata || {},
      methodDescriptor_Gateway_SayHello,
      callback);
};


/**
 * @param {!proto.snapchat.gateway.HelloRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.snapchat.gateway.HelloReply>}
 *     Promise that resolves to the response
 */
proto.snapchat.gateway.GatewayPromiseClient.prototype.sayHello =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/snapchat.gateway.Gateway/SayHello',
      request,
      metadata || {},
      methodDescriptor_Gateway_SayHello);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.snapchat.gateway.RepeatHelloRequest,
 *   !proto.snapchat.gateway.HelloReply>}
 */
const methodDescriptor_Gateway_SayRepeatHello = new grpc.web.MethodDescriptor(
  '/snapchat.gateway.Gateway/SayRepeatHello',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.snapchat.gateway.RepeatHelloRequest,
  proto.snapchat.gateway.HelloReply,
  /**
   * @param {!proto.snapchat.gateway.RepeatHelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.HelloReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.snapchat.gateway.RepeatHelloRequest,
 *   !proto.snapchat.gateway.HelloReply>}
 */
const methodInfo_Gateway_SayRepeatHello = new grpc.web.AbstractClientBase.MethodInfo(
  proto.snapchat.gateway.HelloReply,
  /**
   * @param {!proto.snapchat.gateway.RepeatHelloRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.HelloReply.deserializeBinary
);


/**
 * @param {!proto.snapchat.gateway.RepeatHelloRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.snapchat.gateway.HelloReply>}
 *     The XHR Node Readable Stream
 */
proto.snapchat.gateway.GatewayClient.prototype.sayRepeatHello =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/snapchat.gateway.Gateway/SayRepeatHello',
      request,
      metadata || {},
      methodDescriptor_Gateway_SayRepeatHello);
};


/**
 * @param {!proto.snapchat.gateway.RepeatHelloRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.snapchat.gateway.HelloReply>}
 *     The XHR Node Readable Stream
 */
proto.snapchat.gateway.GatewayPromiseClient.prototype.sayRepeatHello =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/snapchat.gateway.Gateway/SayRepeatHello',
      request,
      metadata || {},
      methodDescriptor_Gateway_SayRepeatHello);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.snapchat.gateway.Message,
 *   !proto.snapchat.gateway.Message>}
 */
const methodDescriptor_Gateway_Connect = new grpc.web.MethodDescriptor(
  '/snapchat.gateway.Gateway/Connect',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.snapchat.gateway.Message,
  proto.snapchat.gateway.Message,
  /**
   * @param {!proto.snapchat.gateway.Message} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.Message.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.snapchat.gateway.Message,
 *   !proto.snapchat.gateway.Message>}
 */
const methodInfo_Gateway_Connect = new grpc.web.AbstractClientBase.MethodInfo(
  proto.snapchat.gateway.Message,
  /**
   * @param {!proto.snapchat.gateway.Message} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.snapchat.gateway.Message.deserializeBinary
);


/**
 * @param {!proto.snapchat.gateway.Message} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.snapchat.gateway.Message>}
 *     The XHR Node Readable Stream
 */
proto.snapchat.gateway.GatewayClient.prototype.connect =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/snapchat.gateway.Gateway/Connect',
      request,
      metadata || {},
      methodDescriptor_Gateway_Connect);
};


/**
 * @param {!proto.snapchat.gateway.Message} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.snapchat.gateway.Message>}
 *     The XHR Node Readable Stream
 */
proto.snapchat.gateway.GatewayPromiseClient.prototype.connect =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/snapchat.gateway.Gateway/Connect',
      request,
      metadata || {},
      methodDescriptor_Gateway_Connect);
};


module.exports = proto.snapchat.gateway;

