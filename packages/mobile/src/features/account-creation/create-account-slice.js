import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {KeyringRpc} from '@docknetwork/react-native-sdk/src/client/keyring-rpc';
import {createSlice} from '@reduxjs/toolkit';
import uuid from 'uuid/v4';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast, withErrorToast} from '../../core/toast';
import {accountActions, accountOperations} from '../accounts/account-slice';
import { translate } from 'src/locales';

const initialState = {
  loading: true,
  form: {},
  mnemonicPhrase: '',
  accountToBackup: null,
};

const createAccount = createSlice({
  name: 'createAccount',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setForm(state, action) {
      state.form = action.payload;
    },
    setMnemonicPhrase(state, action) {
      state.mnemonicPhrase = action.payload;
    },
  },
});

export const createAccountActions = createAccount.actions;

const getRoot = state => state.createAccount;

export const createAccountSelectors = {
  getLoading: state => getRoot(state).loading,
  getForm: state => getRoot(state).form,
  getMnemonicPhrase: state => getRoot(state).mnemonicPhrase,
};

export const createAccountOperations = {
  initFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  importFromJson: (data) => 
    withErrorToast(async (dispatch, getState) => {
      const jsonData = JSON.parse(data);
      
      dispatch(createAccountActions.setForm({
        data: jsonData,
        json: true,
      }));
      navigate(Routes.ACCOUNT_IMPORT_SETUP_PASSWORD);
    }),
  unlockJson: (password) => 
    async (dispatch, getState) => {
      const form = createAccountSelectors.getForm(getState());

      await KeyringRpc.addFromJson(form.data, password);

      dispatch(createAccountActions.setForm({
        ...form,
        password,
        accountName: form.data.meta && form.data.meta.name,
      }));

      navigate(Routes.ACCOUNT_IMPORT_SETUP);
    },
  importFromMnemonic: form =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(null));
      dispatch(
        createAccountActions.setForm({
          ...form,
        }),
      );
      dispatch(createAccountActions.setMnemonicPhrase(form.phrase));
      navigate(Routes.ACCOUNT_IMPORT_SETUP);
    }),
  submitAccountForm: form =>
    withErrorToast(async (dispatch, getState) => {
      dispatch(accountActions.setAccountToBackup(null));
      dispatch(createAccountActions.setForm(form));
      const phrase = await UtilCryptoRpc.mnemonicGenerate(12);
      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_BACKUP);
    }),
  createAccount: ({
    hasBackup = false,
    successMessage = translate('account_setup.success'),
    form: extraForm
  } = {}) =>
    withErrorToast(async (dispatch, getState) => {
      const state = getState();
      const phrase = createAccountSelectors.getMnemonicPhrase(state);
      const form = {
        ...createAccountSelectors.getForm(state),
        ...extraForm,
      }

      const secretId = uuid();
      let {accountName, keypairType, derivationPath} = form;
      let address;

      if (!form.json) {
        address = await KeyringRpc.addressFromUri({
          phrase,
          type: keypairType || 'sr25519',
          derivePath: derivationPath || '',
        });
        
        // Create mnemonic phrase
        await WalletRpc.add({
          '@context': ['https://w3id.org/wallet/v1'],
          id: secretId,
          name: accountName,
          type: 'Mnemonic',
          value: phrase,
        });
      } else {
        address = form.data.address;

        await WalletRpc.add({
          '@context': ['https://w3id.org/wallet/v1'],
          id: secretId,
          name: accountName,
          type: 'Password',
          value: form.password,
        });
      }  

      // Create account
      await WalletRpc.add({
        '@context': ['https://w3id.org/wallet/v1'],
        id: address,
        type: 'Account',
        correlation: [secretId],
        meta: {
          name: accountName,
          keypairType,
          derivationPath,
          hasBackup,
          balance: {
            value: 0,
            symbol: 'DOCK',
          },
        },
      });

      dispatch(accountOperations.loadAccounts());
      navigate(Routes.ACCOUNTS);
      showToast({
        message: successMessage,
      });
    }),
};

export const createAccountReducer = createAccount.reducer;
