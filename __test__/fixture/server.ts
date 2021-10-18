import * as grpc from '@grpc/grpc-js'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  toHandleUnaryCall,
  toHandleBidiStreamingCall,
  toHandleClientStreamingCall,
  toHandleServerStreamingCall,
} from '../../src'
import * as hello_pb from './generated/hello_pb'
import { IHelloServer, HelloService } from './generated/hello_grpc_pb'
import { setTimeout } from 'timers/promises'

const helloServer: IHelloServer = {
  echo: toHandleUnaryCall(async (req, md, call) => {
    call.sendMetadata(md)
    await setTimeout(200)
    return req
  }),
  serverStream: toHandleServerStreamingCall(async (req, md, call) => {
    call.sendMetadata(md)
    return from(Array(5).fill(req))
  }),
  clientStream: toHandleClientStreamingCall(async (req, md, call) => {
    let res: hello_pb.EchoRequest
    await req.forEach((data) => {
      res = data
      // console.log(data.toObject())
    })

    call.sendMetadata(md)

    return res
  }),
  duplexStream: toHandleBidiStreamingCall(async (req, md, call) => {
    call.sendMetadata(md)
    return req.pipe(
      map((data) => {
        // console.log(data.toObject())
        return data
      })
    )
  }),
}

export const start = async (address: string) => {
  const server = new grpc.Server()
  server.addService(HelloService, helloServer)

  return new Promise<grpc.Server>((r) => {
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
      server.start()
      r(server)
    })
  })
}
