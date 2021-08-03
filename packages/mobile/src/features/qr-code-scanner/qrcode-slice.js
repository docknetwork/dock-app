import {createSlice} from '@reduxjs/toolkit';
import { navigateBack } from '../../core/navigation';
import { isWalletConnectUri, walletConnectOperations } from '../wallet-connect/wallet-connect-slice';

const initialState = {
  isLoading: true,
};

const qrCode = createSlice({
  name: 'qrCode',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const qrCodeActions = qrCode.actions;

const getRoot = state => state.qrCode;

export const qrCodeSelectors = {
  getLoading: state => getRoot(state).loading,
};

export const qrCodeOperations = {
  handleQRCode: (data) => async (dispatch, getState) => {
    console.log('QR Code data received', data);

    if (isWalletConnectUri(data)) {
      dispatch(walletConnectOperations.handleSession({ uri: data }));
      navigateBack();
    }
  },
};

export const qrCodeReducer = qrCode.reducer;
