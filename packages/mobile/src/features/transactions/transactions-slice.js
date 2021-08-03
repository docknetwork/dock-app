import {createSlice} from '@reduxjs/toolkit';
import { Toast } from 'native-base';
import { navigate, navigateBack } from '../../core/navigation';
import { Routes } from '../../core/routes';
import { ApiRpc } from '../../rn-rpc-webview/api-rpc';

const initialState = {
  loading: false,
  txQueue: [],
  txHistory: [] 
};

const transactions = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const transactionsActions = transactions.actions;

const getRoot = state => state.transactions;

export const transactionsSelectors = {
  getLoading: state => getRoot(state).loading,
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const transactionsOperations = {
  /**
   * Fetch CREDENTIALs for the current wallet
   *
   * @returns
   */
  sendTokens: ({ addressTo, amount }) => async (dispatch, getState) => {
    // create tx and add to the queue
    Toast.show({
      text: 'Transaction sent!',
    });

    navigateBack();
    
    try {
      await ApiRpc.sendTokens({
        address: addressTo,
        // 1 token equals 25M gas. This is specified in the chain spec here https://github.com/docknetwork/dock-substrate/blob/poa-1/node/src/chain_spec.rs#L320
        amount: parseInt(amount),
      });

      Toast.show({
        type: 'success',
        text: 'Transaction succeed!'
      })
    } catch(err) {
      console.error(err);

      Toast.show({
        type: 'danger',
        text: 'Transaction failed'
      });
    }
  },
};

export const transactionsReducer = transactions.reducer;
