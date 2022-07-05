import {
  useWallet,
  WalletSDKProvider,
} from '@docknetwork/wallet-sdk-react-native/lib';
import '@docknetwork/wallet-sdk-transactions/lib/schema';
import {SENTRY_DSN} from '@env';
import {init as sentryInit} from '@sentry/react-native';
import {Text, useToast, View} from 'native-base';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import {ConfirmationModal} from '../src/components/ConfirmationModal';
import {NavigationRouter} from './core/NavigationRouter';
import store from './core/redux-store';
import './core/setup-env';
import {setToast} from './core/toast';
import {ThemeProvider} from './design-system';
import {appOperations} from './features/app/app-slice';
import {didOperations} from './features/didManagement/didManagment-slice';

if (SENTRY_DSN && process.env.NODE_ENV !== 'test') {
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
  const {status} = useWallet({syncDocs: true});

  useEffect(() => {
    if (status === 'ready') {
      dispatch(didOperations.initializeDID());
    }
  }, [dispatch, status]);
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
      <ConfirmationModal />
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
