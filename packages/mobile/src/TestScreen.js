import {Text, View} from 'native-base';
import React, {useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  walletsOperations,
  walletsSelectors,
} from './features/wallets/wallets-slice';
import { RNRpcWebView } from './rn-rpc-webview';
import { KeyringRpc } from './rn-rpc-webview/keyring-rpc';
import { UtilCryptoRpc } from './rn-rpc-webview/util-crypto-rpc';


export function TestScreen() {
  const dispatch = useDispatch();
  const log = useSelector(walletsSelectors.getLog);


  // useEffect(() => {
  //   console.log('test wallet perofmrnace');
  // }, []);

  return (
    <View>
      
      {/* <RNRpcWebView
        onReady={() => {
          dispatch(walletsOperations.createTestWallet())
        }}
      />
      <Text>Wallet Performance Test</Text>
      
      {
        log.map(item => (
          <View style={{ marginBottom: 8 }} key={item}>
            <Text>{item}</Text>
          </View>
        ))
      } */}
      
    </View>
  );
}
