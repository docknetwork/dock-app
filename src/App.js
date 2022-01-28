import {Box, Button, NativeBaseProvider, Text} from 'native-base';
import React, {useEffect} from 'react';
import WebView from 'react-native-webview';
import './core/setup-env';
import SlpashScreen from 'react-native-splash-screen';
import {
  WalletSDKProvider,
  useWallet,
} from '@docknetwork/wallet-sdk-react-native/lib/index';

const WalletDetails = function () {
  const {wallet, status, documents} = useWallet();

  return (
    <Box>
      <Text>Wallet status: {status}</Text>
      <Text>Wallet docs: {documents.length}</Text>
      <Button onPress={() => wallet.accounts.create({name: 'test'})}>
        <Text>Add document</Text>
      </Button>
    </Box>
  );
};

const App = () => {
  SlpashScreen.hide();

  return (
    <NativeBaseProvider>
      <WalletSDKProvider onReady={() => SlpashScreen.hide()}>
        <Box p={8}>
          <Text>SDK Demo</Text>
          <Text>Test</Text>
        </Box>
        <WalletDetails />
      </WalletSDKProvider>
    </NativeBaseProvider>
  );
};

export default App;
