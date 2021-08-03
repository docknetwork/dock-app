import {rpcRequest} from './rpc-client';

export class DockRpc {
  static init(...params) {
    return rpcRequest('dock.init', ...params);
  }

  static setAccount() {
    return rpcRequest('dock.setAccount');
  }

  static createDID() {
    return rpcRequest('dock.createDID');
  }

  static issueCredential(...params) {
    return rpcRequest('dock.issueCredential', ...params);
  }

  static verifyCredential(...params) {
    return rpcRequest('dock.verifyCredential', ...params);
  }
}
