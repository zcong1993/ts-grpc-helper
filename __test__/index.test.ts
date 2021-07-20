import * as grpc from '@grpc/grpc-js'
import { start } from './fixture/server'
import { getClient } from './fixture/client'
import {
  testClientStream,
  testDuplexStream,
  testServerStream,
  testUnaryCall,
} from './helper'

const address = process.env.ADDRESS || '0.0.0.0:8080'

let server: grpc.Server
const c = getClient(address)

beforeAll(async () => {
  server = await start(address)
})

afterAll(() => {
  c.close()
  server.forceShutdown()
})

describe('unary call', () => {
  testUnaryCall(c)
})

describe('server stream', () => {
  testServerStream(c)
})

describe('client stream', () => {
  testClientStream(c)
})

describe('duplex stream', () => {
  testDuplexStream(c)
})
