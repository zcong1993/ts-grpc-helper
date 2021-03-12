import * as grpc from '@grpc/grpc-js'
import { Observable } from 'rxjs'

export const GRPC_CANCELLED = 'Cancelled'

export const wrapperClientUnaryCall = <Req = any, Res = any>(
  fn: any,
  client: grpc.Client
): ((
  req: Req,
  metadata?: grpc.Metadata,
  callOptions?: grpc.CallOptions
) => Promise<Res>) => {
  const f: any = async (
    req: Req,
    metadata?: grpc.Metadata,
    callOptions?: grpc.CallOptions
  ) => {
    return new Promise((resolve, reject) => {
      fn.call(
        client,
        ...[req, metadata, callOptions].filter(Boolean),
        (err: any, data: any) => {
          if (err) {
            return reject(err)
          }
          resolve(data)
        }
      )
    })
  }

  return f
}

export type ClientReadableStreamRequest<
  T extends grpc.ClientReadableStream<any>
> = T extends grpc.ClientReadableStream<infer Req> ? Req : never

export const readStreamToObserver = <T extends grpc.ClientReadableStream<any>>(
  call: T
): Observable<ClientReadableStreamRequest<T>> => {
  const stream = new Observable<ClientReadableStreamRequest<T>>((observer) => {
    let isClientCanceled = false
    call.on('data', (data: any) => observer.next(data))
    call.on('error', (error: any) => {
      if (error.details === GRPC_CANCELLED) {
        call.destroy()
        if (isClientCanceled) {
          return
        }
      }
      observer.error(error)
    })

    call.on('end', () => {
      call.removeAllListeners()
      observer.complete()
    })

    return () => {
      if ((call as any).finished) {
        return
      }
      isClientCanceled = true
      call.cancel()
    }
  })

  return stream
}

export const observerToWriteStream = <T = any>(
  o: Observable<T>,
  call: grpc.ClientWritableStream<T>
) => {
  const sub = o.subscribe(
    (val) => call.write(val),
    (err: any) => call.emit('error', err),
    () => call.end()
  )

  call.on('end', () => {
    sub.unsubscribe()
    call.removeAllListeners()
  })
}

export interface Response<Res> {
  res: Res
  status: grpc.StatusObject
  metadata: grpc.Metadata
}

export function promisifyUnaryCall<
  T extends (...args: any[]) => grpc.ClientUnaryCall
>(unaryCall: T, c: grpc.Client): PromisifyUnaryCall<T> {
  return ((...args: any) =>
    new Promise((resolve, reject) => {
      const res: any = {}
      const call: grpc.ClientUnaryCall = unaryCall.call(
        c,
        ...args,
        (err: Error, resp: any) => {
          if (err) {
            return reject(err)
          }
          res.res = resp
          resolve(res)
        }
      )

      call.on('metadata', (md) => {
        res.metadata = md
      })

      call.on('status', (status) => {
        res.status = status
      })
    })) as PromisifyUnaryCall<T>
}

// https://stackoverflow.com/questions/51650979/type-inference-with-overloaded-functions
export type Callback<T> = (err: Error | null, reply: T) => void

export type PromisifyUnary<T extends any[]> = T extends [Callback<infer U>?]
  ? () => Promise<Response<U>>
  : T extends [infer T1, Callback<infer P>?]
  ? (arg1: T1) => Promise<Response<P>>
  : T extends [infer T1, infer T2, Callback<infer U>?]
  ? (arg1: T1, arg2: T2) => Promise<Response<U>>
  : T extends [infer T1, infer T2, infer T3, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3) => Promise<Response<U>>
  : T extends [infer T1, infer T2, infer T3, infer T4, Callback<infer U>?]
  ? (arg1: T1, arg2: T2, arg3: T3, arg4: T4) => Promise<Response<U>>
  : T

export type GetOverloadArgs<T> = T extends {
  (...o: infer U): void
  (...o: infer U2): void
  (...o: infer U3): void
}
  ? U | U2 | U3
  : T extends { (...o: infer U): void; (...o: infer U2): void }
  ? U | U2
  : T extends { (...o: infer U): void }
  ? U
  : never

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type PromisifyUnaryCall<T> = UnionToIntersection<
  PromisifyUnary<GetOverloadArgs<T>>
>
