import * as grpc from '@grpc/grpc-js'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  toHandleUnaryCall,
  toHandleBidiStreamingCall,
  toHandleClientStreamingCall,
  toHandleServerStreamingCall,
} from '../src'
import * as hello_pb from './generated/hello_pb'
import { IHelloServer, HelloService } from './generated/hello_grpc_pb'

const helloServer: IHelloServer = {
  echo: toHandleUnaryCall(async (req, md, call) => {
    call.sendMetadata(md)
    return req
  }),
  serverStream: toHandleServerStreamingCall(async (req, _md, _call) => {
    return from(Array(5).fill(req))
  }),
  clientStream: toHandleClientStreamingCall(async (req, md, call) => {
    let res: hello_pb.EchoRequest
    await req.forEach((data) => {
      res = data
      console.log(data.toObject())
    })

    call.sendMetadata(md)

    return res
  }),
  duplexStream: toHandleBidiStreamingCall(async (req, _md, _call) => {
    return req.pipe(
      map((data) => {
        console.log(data.toObject())
        return data
      })
    )
  }),
}

const main = async () => {
  const server = new grpc.Server()
  server.addService(HelloService, helloServer)

  server.bindAsync(
    '0.0.0.0:8080',
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start()
    }
  )
}

main()
