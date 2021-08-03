import {rpcRequest} from './rpc-client';

export class ApiRpc {
  static getAccountBalance(...params) {
    return rpcRequest('api.getAccountBalance', ...params);
  }
 
  static sendTokens(...address) {
    return rpcRequest('api.sendTokens', ...address);
  }
}
