import {createSlice} from '@reduxjs/toolkit';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
// import Keyring from '@polkadot/keyring';
// import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';
import Clipboard from '@react-native-community/clipboard';
import { UtilCryptoRpc } from '../../rn-rpc-webview/util-crypto-rpc';
import { KeyringPairRpc, KeyringRpc } from '../../rn-rpc-webview/keyring-rpc';
import { DockRpc } from '../../rn-rpc-webview/dock-rpc';
import { ApiRpc } from '../../rn-rpc-webview/api-rpc';
import { walletConnectOperations } from '../wallet-connect/wallet-connect-slice';

const initialState = {
  loading: true,
  items: undefined,
  keyring: undefined,
  currentWallet: undefined,
  balance: 1000,
  log: [],
};

let keyring;

const wallets = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      if (!state.items) {
        state.items = [];
      }

      state.items.push(action.payload);
    },
    setLog(state, action) {
      state.log = action.payload;
    },
    removeItem(state, action) {
      const wallet = action.payload;
      state.items = state.items.filter(item => item.address !== wallet.address);
    },
    setKeyring(state, action) {
      keyring = action.payload;
      // state.keyring = action.payload;
    },
    setCurrentWallet(state, action) {
      state.currentWallet = action.payload;
    },
    setBalance(state, action) {
      state.balance = action.payload;
    },
  },
});

export const walletsActions = wallets.actions;

const getRoot = state => state.wallets;


export const walletsSelectors = {
  getLoading: state => getRoot(state).loading,
  getItems: state => getRoot(state).items,
  getKeyring: (state: any): Keyring => keyring,
  getCurrentWallet: (state: any) => getRoot(state).currentWallet,
  getBalance: (state: any) => getRoot(state).balance,
  getLog: (state: any) => getRoot(state).log || [],
};

export async function initDockSdk() {
  try {
    // TODO: Implement network switch
    await DockRpc.init({
      address: 'ws://127.0.0.1:9944',
      // address: 'wss://danforth-1.dock.io',
      // address: 'wss://mainnet-node.dock.io'
    });
  } catch (err) {
    console.error(err);
  }
}

export const walletsOperations = {
  exportJSON: () => async (dispatch, getState) => {
    const state = getState();
    const address = walletsSelectors.getCurrentWallet(state).address;
    const walletJson = walletsSelectors
      .getItems(state)
      .find(wallet => wallet.address === address);
      
    Clipboard.setString(JSON.stringify(walletJson));
  },
  deleteWallet: () => async (dispatch, getState) => {
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    await dispatch(walletsActions.removeItem(wallet));
    navigate(Routes.UNLOCK_WALLET);
  },
  fetchBalance: () => async (dispatch, getState) => {
    dispatch(walletsActions.setLoading(true));
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    const balance = await ApiRpc.getAccountBalance(wallet.address);

    dispatch(walletsActions.setBalance(balance));
    dispatch(walletsActions.setLoading(false));
  },
  initialize: () => async (dispatch, getState) => {
    await UtilCryptoRpc.cryptoWaitReady();
    await KeyringRpc.create();

    // DockRpc.init({
    //   address: 'wss://danforth-1.dock.io',
    // });
    initDockSdk();

    dispatch(walletsActions.setLoading(false));
  },
  createWallet: ({password, walletName}) => async (dispatch, getState) => {
    const mnemonic = await UtilCryptoRpc.mnemonicGenerate(12);
    const pair = await KeyringRpc.addFromMnemonic(mnemonic, {
      name: walletName,
    });

    const encodedPair = await KeyringPairRpc.toJson(password);

    dispatch(walletsActions.addItem(encodedPair));
    dispatch(walletsActions.setCurrentWallet(pair));
    dispatch(walletsOperations.fetchBalance());
    navigate(Routes.CREATE_WALLET_MNEMONIC, {
      mnemonic,
    });
  },
  unlockWallet: ({password, address}) => async (dispatch, getState) => {
    const state = getState();
    const walletJson = walletsSelectors
      .getItems(state)
      .find(wallet => wallet.address === address);

    await KeyringRpc.addFromJson(walletJson);
    await KeyringPairRpc.unlock(password);
    await DockRpc.setAccount();
    
    dispatch(walletConnectOperations.initialize());
    
    
    dispatch(walletsActions.setCurrentWallet(walletJson));
    navigate(Routes.APP_HOME);
    dispatch(walletsOperations.fetchBalance());
  },
  
  /**
   * 
   * Create test wallet for performance check
   */
  createTestWallet: () => async (dispatch, getState) => {
    let startTime = Date.now();
    let log = [];

    const logTime = (action) => {
      log = [
        ...log,
        (`${action} in ${Date.now() - startTime}ms`)
      ]
      dispatch(walletsActions.setLog(log));
      startTime = Date.now();
    }

    logTime('Waiting to get crypto ready...');
    
    await UtilCryptoRpc.cryptoWaitReady();
    
    logTime('Creating keyring...');
    await KeyringRpc.create();

    
    logTime('Generating mnemonic');
    const mnemonic = await UtilCryptoRpc.mnemonicGenerate(12);
    
    logTime('Creating new pair...');
    
    await KeyringPairRpc.addFromMnemonic(mnemonic, {
      name: 'test wallet',
    })
    
    logTime('Pair created');
    
    const encodedPair = await KeyringPairRpc.toJson('mnemdm26');
    
    logTime('Encoded pair created');
    
    console.log(encodedPair);
    
    logTime('Init dock sdk....');
    
    await DockRpc.init({
      address: 'wss://danforth-1.dock.io',
    });
    
    logTime('Dock sdk initialized');
  },
};

export const walletsReducer = wallets.reducer;
