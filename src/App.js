import {SENTRY_DSN} from '@env';
import {init as sentryInit} from '@sentry/react-native';
import {Text, View, useToast} from 'native-base';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import './core/setup-env';
import store from './core/redux-store';
import {ThemeProvider} from './design-system';
import {WalletSDKProvider} from '@docknetwork/wallet-sdk-react-native/lib/index';
import SplashScreen from 'react-native-splash-screen';
// import {ConfirmationModal} from '../src/components/ConfirmationModal';
import {NavigationRouter} from './core/NavigationRouter';
import {setToast} from './core/toast';
import {appOperations} from './features/app/app-slice';
// import {RNRpcWebView} from './rn-rpc-webview';
// import {initRealm} from './core/realm';

// try {
//   sentryInit({
//     dsn: SENTRY_DSN,
//   });
// } catch (err) {
//   console.error(err);
// }

const styles = StyleSheet.create({
  globalComponents: {
    flex: 1,
  },
  globalComponentsInner: {
    height: 0,
  },
});

function GlobalComponents() {
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
      {/*<ConfirmationModal />*/}
    </View>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <WalletSDKProvider>
          <GlobalComponents />
        </WalletSDKProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
