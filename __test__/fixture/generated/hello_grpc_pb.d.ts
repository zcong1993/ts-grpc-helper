// GENERATED CODE -- DO NOT EDIT!

// package: pb
// file: hello.proto

import * as hello_pb from './hello_pb'
import * as grpc from '@grpc/grpc-js'

interface IHelloService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  echo: grpc.MethodDefinition<hello_pb.EchoRequest, hello_pb.EchoRequest>
  serverStream: grpc.MethodDefinition<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
  clientStream: grpc.MethodDefinition<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
  duplexStream: grpc.MethodDefinition<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
}

export const HelloService: IHelloService

export interface IHelloServer extends grpc.UntypedServiceImplementation {
  echo: grpc.handleUnaryCall<hello_pb.EchoRequest, hello_pb.EchoRequest>
  serverStream: grpc.handleServerStreamingCall<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
  clientStream: grpc.handleClientStreamingCall<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
  duplexStream: grpc.handleBidiStreamingCall<
    hello_pb.EchoRequest,
    hello_pb.EchoRequest
  >
}

export class HelloClient extends grpc.Client {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: object
  )
  echo(
    argument: hello_pb.EchoRequest,
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientUnaryCall
  echo(
    argument: hello_pb.EchoRequest,
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientUnaryCall
  echo(
    argument: hello_pb.EchoRequest,
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientUnaryCall
  serverStream(
    argument: hello_pb.EchoRequest,
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientReadableStream<hello_pb.EchoRequest>
  serverStream(
    argument: hello_pb.EchoRequest,
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientReadableStream<hello_pb.EchoRequest>
  clientStream(
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientWritableStream<hello_pb.EchoRequest>
  clientStream(
    metadataOrOptions: grpc.Metadata | grpc.CallOptions | null,
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientWritableStream<hello_pb.EchoRequest>
  clientStream(
    metadata: grpc.Metadata | null,
    options: grpc.CallOptions | null,
    callback: grpc.requestCallback<hello_pb.EchoRequest>
  ): grpc.ClientWritableStream<hello_pb.EchoRequest>
  duplexStream(
    metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null
  ): grpc.ClientDuplexStream<hello_pb.EchoRequest, hello_pb.EchoRequest>
  duplexStream(
    metadata?: grpc.Metadata | null,
    options?: grpc.CallOptions | null
  ): grpc.ClientDuplexStream<hello_pb.EchoRequest, hello_pb.EchoRequest>
}
