import { from, Subject } from 'rxjs'
import * as grpc from '@grpc/grpc-js'
import {
  observerToWriteStream,
  readStreamToObserver,
  promisifyUnaryCall,
  promisifyClientStream,
} from '../src'
import * as pb from './generated/hello_pb'
import { HelloClient } from './generated/hello_grpc_pb'

const sleep = (n: number) => new Promise((r) => setTimeout(r, n))

const testEcho = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test')

  const m = new grpc.Metadata()
  m.set('hello', 'xxx')

  const cc = promisifyUnaryCall(c.echo, c)
  const resp = await cc(req, m)
  console.log(resp)
}

const testStream = async (c: HelloClient) => {
  const req = new pb.EchoRequest()
  req.setMessage('test2')
  const st = c.serverStream(req)
  const result$ = readStreamToObserver(st)
  await result$.forEach((data) => {
    console.log(data.toObject())
  })
}

const testClientStream = async (c: HelloClient) => {
  const m = new grpc.Metadata()
  m.set('hello', 'xxx')

  const [call, p] = promisifyClientStream(c.clientStream, c, m)

  observerToWriteStream(
    from(
      Array(5)
        .fill(null)
        .map((_, i) => {
          const req = new pb.EchoRequest()
          req.setMessage(`test ${i}`)
          return req
        })
    ),
    call
  )

  call.on('metadata', (md) => {
    console.log('md', md)
  })

  const resp = await p
  console.log(resp.toObject())
}

const testClientStream2 = async (c: HelloClient) => {
  const m = new grpc.Metadata()
  m.set('hello', 'xxx')

  return new Promise((resolve, reject) => {
    const call = c.clientStream(m, (err, resp) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(resp.toObject())
        resolve(resp)
      }
    })

    call.on('metadata', (md) => {
      console.log('md', md)
    })

    observerToWriteStream(
      from(
        Array(5)
          .fill(null)
          .map((_, i) => {
            const req = new pb.EchoRequest()
            req.setMessage(`test ${i}`)
            return req
          })
      ),
      call
    )
  })
}

const testDuplexStream = async (c: HelloClient) => {
  const call = c.duplexStream()

  const sub = new Subject<pb.EchoRequest>()

  const result$ = readStreamToObserver(call)
  result$.forEach((data) => {
    console.log(data.toObject())
  })

  observerToWriteStream(sub.asObservable(), call)

  for (let i = 0; i < 5; i++) {
    const req = new pb.EchoRequest()
    req.setMessage(`test ${i}`)
    sub.next(req)
    await sleep(1000)
  }

  sub.complete()
}

const main = async () => {
  const c = new HelloClient('localhost:8080', grpc.credentials.createInsecure())

  console.log('\n\ntest echo\n\n')
  await testEcho(c)
  console.log('\n\ntest server stream\n\n')
  await testStream(c)
  console.log('\n\ntest client stream\n\n')
  await testClientStream(c)
  console.log('\n\ntest client stream 2\n\n')
  await testClientStream2(c)
  console.log('\n\ntest duplex stream\n\n')
  await testDuplexStream(c)
}

main()
