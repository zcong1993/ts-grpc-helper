import { credentials } from '@grpc/grpc-js'
import { HelloClient } from './generated/hello_grpc_pb'

export const getClient = (address: string) => {
  return new HelloClient(address, credentials.createInsecure())
}
