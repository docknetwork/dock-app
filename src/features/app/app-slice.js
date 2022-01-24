import {
  Wallet,
  WalletEvents,
} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {captureException} from '@sentry/react-native';
import SplashScreen from 'react-native-splash-screen';
import {Keychain} from '../../core/keychain';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletActions} from '../wallet/wallet-slice';

export const BiometryType = {
  FaceId: Keychain.BIOMETRY_TYPE.FACE_ID,
  Fingerprint: Keychain.BIOMETRY_TYPE.FINGERPRINT,
};

const initialState = {
  loading: true,
  supportedBiometryType: null,
  rpcReady: false,
  dockReady: false,
  networkId: 'mainnet',
  devSettingsEnabled: false,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setLockedTime(state, action) {
      state.lockedTime = action.payload;
    },
    setRpcReady(state, action) {
      state.rpcReady = action.payload;
    },
    setDockReady(state, action) {
      state.dockReady = action.payload;
    },
    setSupportedBiometryType(state, action) {
      state.supportedBiometryType = action.payload;
    },
    setNetworkId(state, action) {
      state.networkId = action.payload;
    },
    setDevSettingsEnabled(state, action) {
      state.devSettingsEnabled = action.payload;
    },
  },
});

export const appActions = app.actions;

const getRoot = state => state.app;

const walletModule = Wallet.getInstance();

export const appSelectors = {
  getLoading: state => getRoot(state).loading,
  getSupportedBiometryType: state => getRoot(state).supportedBiometryType,
  getRpcReady: state => getRoot(state).rpcReady,
  getDockReady: state => getRoot(state).dockReady,
  getNetworkId: state => {
    if (!appSelectors.getDevSettingsEnabled(state)) {
      return 'mainnet';
    }

    return getRoot(state).networkId;
  },
  getDevSettingsEnabled: state => getRoot(state).devSettingsEnabled,
  getAppLocked: state => getRoot(state).lockedTime > Date.now(),
};

export const appOperations = {
  waitRpcReady: () => async (dispatch, getState) => {
    return new Promise(res => {
      const checkRpc = () => {
        if (appSelectors.getRpcReady(getState())) {
          return res();
        }

        setTimeout(checkRpc, 500);
      };

      checkRpc();
    });
  },
  waitDockReady: () => async (dispatch, getState) => {
    return new Promise(res => {
      const checkDock = () => {
        if (appSelectors.getDockReady(getState())) {
          return res();
        }

        setTimeout(checkDock, 500);
      };

      checkDock();
    });
  },
  rpcReady: () => async (dispatch, getState) => {
    await walletModule.load();
    dispatch(appActions.setDockReady(true));
  },

  initSdkEvents: () => async (dispatch, getState) => {
    walletModule.eventManager.on(WalletEvents.networkUpdated, networkId => {
      dispatch(appActions.setNetworkId(networkId));
    });
  },
  initialize: () => async (dispatch, getState) => {
    SplashScreen.hide();

    if (!appSelectors.getDevSettingsEnabled(getState())) {
      walletModule.networkManager.setNetworkId('mainnet');
    }

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
        captureException(err);
      }
    }

    if (walletCreated) {
      navigate(Routes.UNLOCK_WALLET);
    } else {
      navigate(Routes.CREATE_WALLET);
    }
  },

  setNetwork: networkId => async (dispatch, getState) => {
    Wallet.getInstance().networkManager.setNetworkId(networkId);
    await Wallet.getInstance().initNetwork();
  },
};

export const appReducer = app.reducer;
