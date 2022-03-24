import {JSONRPCServer} from 'json-rpc-2.0';
import {
  createRpcService,
  patchRpcServer,
} from '@docknetwork/wallet-sdk-core/lib/rpc-util';
import storageService from './async-storage-service';
import logger from './logger';
import {Logger} from 'src/core/logger';

const rpcServer = new JSONRPCServer();

patchRpcServer(rpcServer);

if (process.env.NODE_ENV !== 'test') {
  [storageService, logger].forEach(service => {
    const rpcService = createRpcService(service);

    rpcService.forEach(method => {
      Logger.debug('RN: Register register method', method);

      rpcServer.addMethod(method.name, async params => {
        const result = await method.resolver(params);

        Logger.debug('Resolving rpc request', {
          method,
          result,
        });
        return result || {};
      });
    });
  });
}

export default rpcServer;
