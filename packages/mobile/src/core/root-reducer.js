import {combineReducers} from '@reduxjs/toolkit';
import {credentialReducer} from '../features/credentials/credential-slice';
import {didReducer} from '../features/did/did-slice';
import {walletsReducer} from '../features/wallets/wallets-slice';
import {credIssuanceReducer} from '../features/credential-issuance/cred-issuance-slice';
import {walletConnectReducer} from '../features/wallet-connect/wallet-connect-slice';
import {qrCodeReducer} from '../features/qr-code-scanner/qrcode-slice';
import {transactionsReducer} from '../features/transactions/transactions-slice';
import {backupReducer} from '../features/wallet-backup/wallet-backup-slice';
import { appReducer } from '../features/app/app-slice';
import { walletReducer } from '../features/wallet/wallet-slice';
import { accountReducer } from '../features/accounts/account-slice';
import { createAccountReducer } from '../features/account-creation/create-account-slice';

export const rootReducer = combineReducers({
  app: appReducer,
  wallet: walletReducer,
  account: accountReducer,
  createAccount: createAccountReducer,

  // POC reducers
  wallets: walletsReducer,
  did: didReducer,
  credential: credentialReducer,
  credIssuance: credIssuanceReducer,
  walletConnect: walletConnectReducer,
  qrCode: qrCodeReducer,
  transactions: transactionsReducer,
  backup: backupReducer,
});
