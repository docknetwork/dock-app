import {JSONRPCClient} from 'json-rpc-2.0';

let client;

export const getRpcClient = () => client;
export const rpcRequest = (name, ...params) => client.request(name, ...params);
export const setRpcClient = (c) => {
  client = c;
}

export function initRpcClient(webView) {
  client = new JSONRPCClient(async jsonRPCRequest => {
    webView.injectJavaScript(`
    (function(){
      (navigator.appVersion.includes("Android") ? document : window).dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
        {
          type: 'json-rpc-request',
          body: jsonRPCRequest,
        },
      )}}));
    })();

    `);
  });

  client.__request = client.request;
  client.request = (name, ...params) => {
    console.log('rpc request', {name, params});
    const reqParams =
      params.length === 0
        ? params[0]
        : {
            __args: params,
          };

    return client.__request(name, reqParams);
  };
}
