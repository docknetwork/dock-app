import { Buckets, PrivateKey} from '@textile/hub'
import { Toast } from 'native-base';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';

import {createSlice} from '@reduxjs/toolkit';
import { walletsActions, walletsOperations } from '../wallets/wallets-slice';
import { KeyringPairRpc, KeyringRpc } from '../../rn-rpc-webview/keyring-rpc';
import { walletConnectOperations } from '../wallet-connect/wallet-connect-slice';
import { DockRpc } from '../../rn-rpc-webview/dock-rpc';

const initialState = {
  loading: false,
  keyInfo: {
    key: 'bkri6m2bdfq2fnzrmqsympy3iki',
    secret: 'bmidmn5uua5etuhivwg2dwnardkgl7u3socwy2vy'
  },
};

const backup = createSlice({
  name: 'backup',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setKeyInfo(state, action) {
      state.keyInfo = action.payload;
    }
  },
});

export const backupActions = backup.actions;

const getRoot = state => state.backup;

export const backupSelectors = {
  getLoading: state => getRoot(state).loading,
  getKeyInfo: state => getRoot(state).keyInfo,
};


export const backupOperations = {

  /**
   * Create backup
   * @param {*} param0 
   * @returns 
   */
  createWalletBackup: ({ fileName, password }) => async (dispatch, getState) => {
    dispatch(backupActions.setLoading(true));
    
    const keyInfo = backupSelectors.getKeyInfo(getState());

    try {
      Toast.show({
        type: 'success',
        text: 'Backup created!'
      });

      const walletJson = await KeyringPairRpc.toJson(password);
      const identity = await PrivateKey.fromRandom();
      const buckets = await Buckets.withKeyInfo(keyInfo)

      await buckets.getToken(identity);
    
      const bucket = await buckets.getOrCreate('dock-wallet');
      
      await buckets.pushPath(bucket.root.key, fileName, {
        path: `/${fileName}`,
        content: Buffer.from(JSON.stringify(walletJson))
      });

      console.log('Create backup at', fileName);
    } catch(err) {
      console.error(err);

      Toast.show({
        type: 'danger',
        text: 'Unable to create the backup'
      });
    }
    
    dispatch(backupActions.setLoading(false));
  },

  /**
   * Load backup
   * @param {*} param0 
   * @returns 
   */
  loadWalletBackup: ({ fileName, password }) => async (dispatch, getState) => {
    dispatch(backupActions.setLoading(true));
    const keyInfo = backupSelectors.getKeyInfo(getState());

    try {
      Toast.show({
        type: 'success',
        text: 'Backup loaded!'
      });

      const identity = await PrivateKey.fromRandom();
      const buckets = await Buckets.withKeyInfo(keyInfo)

      await buckets.getToken(identity);

      const bucket = await buckets.getOrCreate('dock-wallet');
      const walletJSON = await buckets.pullPath(bucket.root.key, fileName);

      await KeyringRpc.addFromJson(JSON.parse(walletJSON));
      await KeyringPairRpc.unlock(password);
      await DockRpc.setAccount();
      
      dispatch(walletConnectOperations.initialize());
      
      
      dispatch(walletsActions.setCurrentWallet(walletJson));
      navigate(Routes.APP_HOME);
      dispatch(walletsOperations.fetchBalance());

      console.log('Load backup from', fileName);
    } catch(err) {
      console.error(err);

      Toast.show({
        type: 'danger',
        text: 'Unable to load the backup'
      });
    }

    dispatch(backupActions.setLoading(false));
  },
};

export const backupReducer = backup.reducer;
