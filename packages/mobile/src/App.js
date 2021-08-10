import React, {useEffect} from 'react';
import {APP_RUNTIME} from '@env';
import {Provider, useDispatch} from 'react-redux';
import {useToast, View} from 'native-base';
import store from './core/redux-store';
import {NavigationRouter} from './core/NavigationRouter';
import {RNRpcWebView} from './rn-rpc-webview';
import {ConfirmConnectionModal} from './features/wallet-connect/ConfirmConnectionModal';
import {appOperations} from './features/app/app-slice';
import { ThemeProvider } from './design-system';
import { setToast } from './core/toast';
import {ConfirmationModal} from '../src/components/ConfirmationModal';
import {TestView} from '@docknetwork/wallet-components/lib/Test';

function GlobalComponents({ NavigationComponent, RpcComponent = RNRpcWebView }) {
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(appOperations.initialize());
  }, []);

  useEffect(() => {
    setToast(toast);
  }, [toast]);

  return (
    <View style={{flex: 1}}>
      <NavigationComponent />
      <View style={{height: 0}}>
        <RpcComponent
          onReady={() => {
            dispatch(appOperations.rpcReady());
          }}
        />
      </View>
      <ConfirmConnectionModal />
      <ConfirmationModal />
    </View>
  );
}

const App = ({ NavigationComponent, RpcComponent }) => {
  
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* <TestView /> */}
        {/* <StyleProvider style={getTheme(material)}> */}
          <GlobalComponents NavigationComponent={NavigationComponent || NavigationRouter} RpcComponent={RpcComponent} />
          {/* <TestScreen /> */}
        {/* </StyleProvider> */}
      </ThemeProvider>
    </Provider>
  );
};

let exportedApp = App;

// if (APP_RUNTIME === 'storybook') {
// exportedApp = require('../storybook').default;
// }

export default exportedApp;
