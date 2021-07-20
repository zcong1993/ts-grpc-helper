// GENERATED CODE -- DO NOT EDIT!

'use strict'
var grpc = require('@grpc/grpc-js')
var hello_pb = require('./hello_pb.js')

function serialize_pb_EchoRequest(arg) {
  if (!(arg instanceof hello_pb.EchoRequest)) {
    throw new Error('Expected argument of type pb.EchoRequest')
  }
  return Buffer.from(arg.serializeBinary())
}

function deserialize_pb_EchoRequest(buffer_arg) {
  return hello_pb.EchoRequest.deserializeBinary(new Uint8Array(buffer_arg))
}

var HelloService = (exports.HelloService = {
  echo: {
    path: '/pb.Hello/Echo',
    requestStream: false,
    responseStream: false,
    requestType: hello_pb.EchoRequest,
    responseType: hello_pb.EchoRequest,
    requestSerialize: serialize_pb_EchoRequest,
    requestDeserialize: deserialize_pb_EchoRequest,
    responseSerialize: serialize_pb_EchoRequest,
    responseDeserialize: deserialize_pb_EchoRequest,
  },
  serverStream: {
    path: '/pb.Hello/ServerStream',
    requestStream: false,
    responseStream: true,
    requestType: hello_pb.EchoRequest,
    responseType: hello_pb.EchoRequest,
    requestSerialize: serialize_pb_EchoRequest,
    requestDeserialize: deserialize_pb_EchoRequest,
    responseSerialize: serialize_pb_EchoRequest,
    responseDeserialize: deserialize_pb_EchoRequest,
  },
  clientStream: {
    path: '/pb.Hello/ClientStream',
    requestStream: true,
    responseStream: false,
    requestType: hello_pb.EchoRequest,
    responseType: hello_pb.EchoRequest,
    requestSerialize: serialize_pb_EchoRequest,
    requestDeserialize: deserialize_pb_EchoRequest,
    responseSerialize: serialize_pb_EchoRequest,
    responseDeserialize: deserialize_pb_EchoRequest,
  },
  duplexStream: {
    path: '/pb.Hello/DuplexStream',
    requestStream: true,
    responseStream: true,
    requestType: hello_pb.EchoRequest,
    responseType: hello_pb.EchoRequest,
    requestSerialize: serialize_pb_EchoRequest,
    requestDeserialize: deserialize_pb_EchoRequest,
    responseSerialize: serialize_pb_EchoRequest,
    responseDeserialize: deserialize_pb_EchoRequest,
  },
})

exports.HelloClient = grpc.makeGenericClientConstructor(HelloService)
