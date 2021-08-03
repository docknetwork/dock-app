import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {SplashScreen} from '@docknetwork/mobile-wallet/src/features/app/SplashScreen';
import {CreateWalletScreen} from '@docknetwork/mobile-wallet/src/features/wallet/CreateWalletScreen';
// import {CreateWalletScreen} from '../features/wallet/CreateWalletScreen';

import { View } from "native-base";

export function WebRouter(props) {
  // debugger;
  return <CreateWalletScreen />;
}
