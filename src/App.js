import {SENTRY_DSN} from '@env';
import {init as sentryInit} from '@sentry/react-native';
import {useToast, View, Text} from 'native-base';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import './core/setup-env';
import {ConfirmationModal} from '../src/components/ConfirmationModal';
import {NavigationRouter} from './core/NavigationRouter';
import store from './core/redux-store';
import {setToast} from './core/toast';
import {ThemeProvider} from './design-system';
import {appOperations} from './features/app/app-slice';
import {RNRpcWebView} from './rn-rpc-webview';
import {WalletSDKProvider} from '@docknetwork/wallet-sdk-react-native/lib';
import {AppIntegrationTest} from './wallet-sdk/AppIntegrationTest';

if (process.env.NODE_ENV !== 'test') {
  try {
    sentryInit({
      dsn: SENTRY_DSN,
    });
  } catch (err) {
    console.error(err);
  }
}

const styles = StyleSheet.create({
  globalComponents: {
    flex: 1,
  },
  globalComponentsInner: {
    height: 0,
  },
});

export function Test() {
  return (
    <View>
      <Text>testing</Text>
    </View>
  );
}

export function GlobalComponents() {
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(appOperations.initialize());
  }, [dispatch]);

  useEffect(() => {
    setToast(toast);
  }, [toast]);

  return (
    <View style={styles.globalComponents}>
      <NavigationRouter />
      <View style={styles.globalComponentsInner}>
        <RNRpcWebView
          onReady={() => {
            dispatch(appOperations.rpcReady());
          }}
        />
      </View>
      <ConfirmationModal />
    </View>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <WalletSDKProvider>
          {/* <GlobalComponents /> */}
          <AppIntegrationTest />
        </WalletSDKProvider>
      </ThemeProvider>
    </Provider>
  );
};

let exportedApp = App;

// if (APP_RUNTIME === 'storybook') {
// exportedApp = require('../storybook').default;
// }

export default exportedApp;
