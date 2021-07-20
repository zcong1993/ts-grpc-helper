// package: pb
// file: hello.proto

import * as jspb from 'google-protobuf'

export class EchoRequest extends jspb.Message {
  getMessage(): string
  setMessage(value: string): void

  serializeBinary(): Uint8Array
  toObject(includeInstance?: boolean): EchoRequest.AsObject
  static toObject(
    includeInstance: boolean,
    msg: EchoRequest
  ): EchoRequest.AsObject
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> }
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>
  }
  static serializeBinaryToWriter(
    message: EchoRequest,
    writer: jspb.BinaryWriter
  ): void
  static deserializeBinary(bytes: Uint8Array): EchoRequest
  static deserializeBinaryFromReader(
    message: EchoRequest,
    reader: jspb.BinaryReader
  ): EchoRequest
}

export namespace EchoRequest {
  export type AsObject = {
    message: string
  }
}
