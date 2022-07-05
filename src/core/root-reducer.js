import {combineReducers} from '@reduxjs/toolkit';
import {qrCodeReducer} from '../features/qr-code-scanner/qrcode-slice';
import {transactionsReducer} from '../features/transactions/transactions-slice';
import {appReducer} from '../features/app/app-slice';
import {walletReducer} from '../features/wallet/wallet-slice';
import {accountReducer} from '../features/accounts/account-slice';
import {createAccountReducer} from '../features/account-creation/create-account-slice';
import {authenticationReducer} from '../features/unlock-wallet/unlock-wallet-slice';

export const rootReducer = combineReducers({
  app: appReducer,
  wallet: walletReducer,
  account: accountReducer,
  createAccount: createAccountReducer,
  qrCode: qrCodeReducer,
  transactions: transactionsReducer,
  authentication: authenticationReducer,
});
