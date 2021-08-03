import {rpcRequest} from './rpc-client';

export class WalletRpc {
  static create(...params) {
    return rpcRequest('wallet.create', ...params);
  }

  static unlock(...address) {
    return rpcRequest('wallet.unlock', ...address);
  }

  static load(...address) {
    return rpcRequest('wallet.load', ...address);
  }
}
