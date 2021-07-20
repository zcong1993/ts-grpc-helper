import * as grpc from '@grpc/grpc-js'
import { from, Subject } from 'rxjs'
import { toArray } from 'rxjs/operators'
import {
  observerToWriteStream,
  promisifyClientStream,
  promisifyUnaryCall,
  readStreamToObserver,
} from '../src'
import { HelloClient } from './fixture/generated/hello_grpc_pb'
import * as pb from './fixture/generated/hello_pb'

const expectMd = (call: any, expectKey: string, expectVal: string) => {
  let mdReceived = false

  call.on('metadata', (md: grpc.Metadata) => {
    mdReceived = true
    expect(md.getMap()['hello']).toEqual('xxx')
  })

  return () => {
    expect(mdReceived).toBeTruthy()
  }
}

export const testUnaryCall = (c: HelloClient) => {
  it('simple should works well', async () => {
    const req = new pb.EchoRequest()
    req.setMessage('test')

    const resp = await promisifyUnaryCall(c.echo, c)(req)
    expect(resp.res).toEqual(req)
  })

  it('with metadata should works well', async () => {
    const req = new pb.EchoRequest()
    req.setMessage('test')
    const m = new grpc.Metadata()
    m.set('hello', 'xxx')

    const resp = await promisifyUnaryCall(c.echo, c)(req, m)
    expect(resp.res).toEqual(req)
    expect(resp.metadata.getMap()['hello']).toEqual('xxx')
  })
}

export const testServerStream = (c: HelloClient) => {
  it('simple should works well', async () => {
    const req = new pb.EchoRequest()
    req.setMessage('test2')
    const st = c.serverStream(req)
    const result$ = readStreamToObserver(st)
    let i = 0
    await result$.forEach((data) => {
      i++
      expect(data).toEqual(req)
    })

    expect(i).toBe(5)
  })

  it('with metadata should works well', async () => {
    const req = new pb.EchoRequest()
    req.setMessage('test2')

    const m = new grpc.Metadata()
    m.set('hello', 'xxx')

    const st = c.serverStream(req, m)

    const cb = expectMd(st, 'hello', 'xxx')

    const result$ = readStreamToObserver(st)
    await result$.forEach((data) => {
      expect(data).toEqual(req)
    })

    cb()
  })
}

export const testClientStream = (c: HelloClient) => {
  it('simple should works well', async () => {
    const [call, p] = promisifyClientStream(c.clientStream, c)
    let last: pb.EchoRequest

    observerToWriteStream(
      from(
        Array(5)
          .fill(null)
          .map((_, i) => {
            const req = new pb.EchoRequest()
            req.setMessage(`test ${i}`)
            last = req
            return req
          })
      ),
      call
    )

    const resp = await p
    expect(resp).toEqual(last)
  })

  it('with metadata should works well', async () => {
    const m = new grpc.Metadata()
    m.set('hello', 'xxx')

    const [call, p] = promisifyClientStream(c.clientStream, c, m)
    const cb = expectMd(call, 'hello', 'xxx')
    let last: pb.EchoRequest

    observerToWriteStream(
      from(
        Array(5)
          .fill(null)
          .map((_, i) => {
            const req = new pb.EchoRequest()
            req.setMessage(`test ${i}`)
            last = req
            return req
          })
      ),
      call
    )

    const resp = await p
    expect(resp).toEqual(last)
    cb()
  })
}

export const testDuplexStream = (c: HelloClient) => {
  it('simple should works well', async () => {
    const call = c.duplexStream()

    const sub = new Subject<pb.EchoRequest>()

    const reqs: pb.EchoRequest[] = []

    const result$ = readStreamToObserver(call)

    observerToWriteStream(sub.asObservable(), call)

    for (let i = 0; i < 5; i++) {
      const req = new pb.EchoRequest()
      req.setMessage(`test ${i}`)
      reqs.push(req)
      sub.next(req)
    }

    sub.complete()

    const res = await result$.pipe(toArray()).toPromise()
    expect(res.map((r) => r.toObject())).toEqual(reqs.map((r) => r.toObject()))
  })

  it('with metadata should works well', async () => {
    const m = new grpc.Metadata()
    m.set('hello', 'xxx')

    const call = c.duplexStream(m)

    const cb = expectMd(call, 'hello', 'xxx')

    const sub = new Subject<pb.EchoRequest>()

    const reqs: pb.EchoRequest[] = []

    const result$ = readStreamToObserver(call)

    observerToWriteStream(sub.asObservable(), call)

    for (let i = 0; i < 5; i++) {
      const req = new pb.EchoRequest()
      req.setMessage(`test ${i}`)
      reqs.push(req)
      sub.next(req)
    }

    sub.complete()

    const res = await result$.pipe(toArray()).toPromise()
    expect(res.map((r) => r.toObject())).toEqual(reqs.map((r) => r.toObject()))

    cb()
  })
}
