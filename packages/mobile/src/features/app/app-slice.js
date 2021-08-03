import {createSlice} from '@reduxjs/toolkit';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyringRpc} from '@docknetwork/react-native-sdk/src/client/keyring-rpc';
import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import SplashScreen from 'react-native-splash-screen';
import {Keychain} from '../../core/keychain';
import {walletActions} from '../wallet/wallet-slice';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';

export const BiometryType = {
  FaceId: Keychain.BIOMETRY_TYPE.FACE_ID,
  Fingerprint: Keychain.BIOMETRY_TYPE.FINGERPRINT,
};

const initialState = {
  loading: true,
  supportedBiometryType: null,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSupportedBiometryType(state, action) {
      state.supportedBiometryType = action.payload;
    },
  },
});

export const appActions = app.actions;

const getRoot = state => state.app;

export const appSelectors = {
  getLoading: state => getRoot(state).loading,
  getSupportedBiometryType: state => getRoot(state).supportedBiometryType,
};

export const appOperations = {
  rpcReady: () => async (dispatch, getState) => {
    await UtilCryptoRpc.cryptoWaitReady();
    await KeyringRpc.initialize();
    await WalletRpc.create('wallet');
    await WalletRpc.load();
    await WalletRpc.sync();
  },
  initialize: () => async (dispatch, getState) => {
    SplashScreen.hide();

    await Keychain.getSupportedBiometryType().then(value => {
      let type;

      if (value === Keychain.BIOMETRY_TYPE.FACE_ID) {
        type = BiometryType.FaceId;
      } else if (
        value === Keychain.BIOMETRY_TYPE.TOUCH_ID ||
        value === Keychain.BIOMETRY_TYPE.FINGERPRINT
      ) {
        type = BiometryType.Fingerprint;
      }

      dispatch(appActions.setSupportedBiometryType(type));
    });

    const walletInfo = await AsyncStorage.getItem('walletInfo');
    let walletCreated;

    if (walletInfo) {
      try {
        dispatch(walletActions.setWalletInfo(JSON.parse(walletInfo)));
        walletCreated = true;
      } catch (err) {
        console.error(err);
      }
    }

    if (walletCreated) {
      navigate(Routes.UNLOCK_WALLET);
    } else {
      navigate(Routes.CREATE_WALLET);
    }
  },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const appReducer = app.reducer;
