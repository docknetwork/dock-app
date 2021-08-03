import { rpcRequest } from "./rpc-client";

export class UtilCryptoRpc {
  static cryptoWaitReady() {
    return rpcRequest('utilCrypto.cryptoWaitReady');
  }

  static cryptoIsReady(...params) {
    return rpcRequest('utilCrypto.cryptoIsReady', ...params);
  }

  static mnemonicGenerate(...params) {
    return rpcRequest('utilCrypto.mnemonicGenerate', ...params);
  }
}