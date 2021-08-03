import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TestView } from '@docknetwork/wallet-components/lib/Test';
import App from '@docknetwork/mobile-wallet/src/App';
import { NativeBaseProvider } from 'native-base';
import { WebRouter } from './WebRouter';
import { DockRpcWeb } from './DockRpcWeb';

function WebApp() {
  return (
    <div className="App">
       <App RpcComponent={DockRpcWeb}/>
    </div>
  );
}

export default WebApp;
