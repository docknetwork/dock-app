import {JSONRPCServer} from 'json-rpc-2.0';
import {createRpcService} from '@docknetwork/react-native-sdk/src/rpc-util';
import storageService from './async-storage-service';
import logger from './logger';


const rpcServer = new JSONRPCServer();

[
  storageService,
  logger,
].forEach(service => {
  const rpcService = createRpcService(service);

  rpcService.forEach(method => {
    console.log('RN: Register register method', method);

    rpcServer.addMethod(method.name, async (params) => {
      const result = await method.resolver(params);
      
      console.log('Resolving rpc request', {
        method, result
      })
      return result || {};
    });
  });
});

export default rpcServer;
