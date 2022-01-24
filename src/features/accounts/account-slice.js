import {PolkadotUIRpc} from '@docknetwork/wallet-sdk-core/lib/client/polkadot-ui-rpc';
import {Accounts} from '@docknetwork/wallet-sdk-core/lib/modules/accounts';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {createSlice} from '@reduxjs/toolkit';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {translate} from 'src/locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast, withErrorToast} from '../../core/toast';
import {createAccountActions} from '../account-creation/create-account-slice';
import {appOperations} from '../app/app-slice';

const initialState = {
  loading: true,
  accounts: [],
  accountToBackup: null,
};

const walletModule = Wallet.getInstance();
const accountsModule = Accounts.getInstance();

export const accountReducers = {
  setLoading(state, action) {
    state.loading = action.payload;
  },
  setAccounts(state, action) {
    state.accounts = action.payload;
  },
  removeAccount(state, action) {
    state.accounts = state.accounts.filter(item => item.id !== action.payload);
  },
  setAccount(state, action) {
    state.accounts = state.accounts.map(account => {
      if (account.id === action.payload.id) {
        return {
          ...account,
          ...action.payload,
        };
      }

      return account;
    });
  },
  setAccountToBackup(state, action) {
    state.accountToBackup = action.payload;
  },
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: accountReducers,
});

export const accountActions = accountSlice.actions;

const getRoot = state => state.account;

export function exportFile({path, mimeType, errorMessage}) {
  return Share.open({
    url: 'file://' + path,
    type: mimeType,
  })
    .catch(err => {
      if (err.message === 'User did not share') {
        return;
      }

      console.error(err);
      showToast({
        message: errorMessage,
        type: 'error',
      });
    })
    .finally(() => {
      RNFS.unlink(path);
    });
}

export const accountSelectors = {
  getLoading: state => getRoot(state).loading,
  getAccounts: state => getRoot(state).accounts,
  getAccountById: id => state =>
    getRoot(state).accounts.find(account => account.id === id),
  getAccountToBackup: state => getRoot(state).accountToBackup,
};

export const accountOperations = {
  confirmAccountBackup: () =>
    withErrorToast(async (dispatch, getState) => {
      const account = accountSelectors.getAccountToBackup(getState());

      if (!account) {
        return;
      }

      const updatedAccount = {
        ...account,
        meta: {
          ...account.meta,
          hasBackup: true,
        },
      };

      await accountsModule.update(updatedAccount);

      dispatch(accountActions.setAccountToBackup(null));

      navigate(Routes.ACCOUNT_DETAILS, {
        id: account.id,
      });

      showToast({
        message: translate('create_account_backup.success'),
      });
    }),

  backupAccount: account =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(account));

      const result = await accountsModule.getAccounts(account.id);
      const mnemonicDoc = result.correlations.find(
        Accounts.DocumentFilters.mnemonicType,
      );
      const phrase = mnemonicDoc.value;

      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_MNEMONIC);
    }),
  addAccountFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },

  exportAccountAs:
    ({accountId, method, password}) =>
    async (dispatch, getState) => {
      const encryptedAccount = await accountsModule.exportAccount(
        accountId,
        password,
      );
      const jsonData = JSON.stringify(encryptedAccount);

      let qrCodeData;

      if (method === 'json') {
        const path = `${RNFS.DocumentDirectoryPath}/${accountId}.json`;
        const mimeType = 'application/json';
        await RNFS.writeFile(path, jsonData);

        exportFile({
          path,
          mimeType,
          errorMessage: translate('account_details.export_error'),
        });
      } else {
        qrCodeData = jsonData;
      }

      navigate(Routes.ACCOUNT_DETAILS, {
        accountId,
        qrCodeData,
      });

      showToast({
        message: translate('account_details.export_success'),
      });
    },
  removeAccount: (account: any) => async (dispatch, getState) => {
    try {
      accountsModule.remove(account.id);

      dispatch(accountOperations.loadAccounts());

      showToast({
        message: translate('account_details.account_removed'),
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: translate('account_details.unable_to_remove_account'),
        type: 'error',
      });
    }
  },
  getPolkadotSvgIcon:
    (address, isAlternative) => async (dispatch, getState) => {
      await dispatch(appOperations.waitRpcReady());
      return PolkadotUIRpc.getPolkadotSvgIcon(address, isAlternative);
    },
  loadAccounts: () => async (dispatch, getState) => {
    const accounts = await accountsModule.load();
    dispatch(accountActions.setAccounts(accounts));
  },
  watchAccount:
    ({name, address}) =>
    async (dispatch, getState) => {
      await walletModule.add({
        id: address,
        type: 'Account',
        meta: {
          name: name,
          readOnly: true,
        },
      });

      dispatch(accountOperations.loadAccounts());
    },
};

export const accountReducer = accountSlice.reducer;
