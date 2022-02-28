import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet/index';
// import {UtilCryptoRpc} from '@docknetwork/wallet-sdk-core/lib/client/util-crypto-rpc';
// import {KeyringRpc} from '@docknetwork/wallet-sdk-core/lib/client/keyring-rpc';
import {createSlice} from '@reduxjs/toolkit';
import uuid from 'uuid/v4';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast, withErrorToast} from '../../core/toast';
import {
  accountActions,
  accountOperations,
  accountSelectors,
} from '../accounts/account-slice';
import {translate} from 'src/locales';
import {keyringService} from '@docknetwork/wallet-sdk-core/lib/services/keyring';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {Accounts} from '@docknetwork/wallet-sdk-core/lib/modules/accounts';
import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';

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

function validateDerivationPath({phrase, type = 'sr25519', derivePath = ''}) {
  return keyringService
    .addressFromUri({
      mnemonic: phrase,
      type,
      derivePath,
    })

    .then(() => true)
    .catch(() => false);
}

async function validateAdvancedOptionsForm({phrase, form}) {
  const isDerivationPathValid = await validateDerivationPath({
    phrase,
    type: form.keypairType || 'sr25519',
    derivePath: form.derivationPath || '',
  });

  if (!isDerivationPathValid) {
    showToast({
      type: 'error',
      message: translate('account_advanced_options.invalid_derivation_path'),
    });
  }

  return isDerivationPathValid;
}

export const createAccountOperations = {
  initFlow: () => async (dispatch, getState) => {
    navigate(Routes.CREATE_ACCOUNT_SETUP);
  },
  checkExistingAccount: address => (dispatch, getState) => {
    const accounts = accountSelectors.getAccounts(getState());
    const accountExists = accounts.find(ac => ac.id === address);

    if (accountExists) {
      showToast({
        message: translate('import_account.existing_account'),
        type: 'error',
      });

      return true;
    }

    return false;
  },
  importFromJson: data =>
    withErrorToast(async (dispatch, getState) => {
      const jsonData = JSON.parse(data);

      if (
        await dispatch(
          createAccountOperations.checkExistingAccount(jsonData.address),
        )
      ) {
        return;
      }

      dispatch(
        createAccountActions.setForm({
          data: jsonData,
          json: true,
        }),
      );
      navigate(Routes.ACCOUNT_IMPORT_SETUP_PASSWORD);
    }, translate('import_account.invalid_account_data')),
  unlockJson: password => async (dispatch, getState) => {
    const form = createAccountSelectors.getForm(getState());
    const keyPairJson = await KeyringRpc.addFromJson(form.data, password);

    dispatch(
      createAccountActions.setForm({
        ...form,
        keyPairJson,
        password,
        accountName: form.data.meta && form.data.meta.name,
      }),
    );

    navigate(Routes.ACCOUNT_IMPORT_SETUP);
  },
  importFromMnemonic: form =>
    withErrorToast(async (dispatch, getState) => {
      const phrase = form.phrase.trim();
      const isValidPhrase = await UtilCryptoRpc.mnemonicValidate(phrase);

      if (!isValidPhrase) {
        showToast({
          message: translate('import_account_from_mnemonic.invalid_phrase'),
          type: 'error',
        });

        return;
      }

      const isAdvancedOptionsValid = await validateAdvancedOptionsForm({
        phrase,
        form,
      });

      if (!isAdvancedOptionsValid) {
        return;
      }

      const address = await KeyringRpc.addressFromUri({
        phrase,
        type: form.keypairType || 'sr25519',
        derivePath: form.derivationPath || '',
      });

      if (
        await dispatch(createAccountOperations.checkExistingAccount(address))
      ) {
        return;
      }

      dispatch(accountActions.setAccountToBackup(null));
      dispatch(
        createAccountActions.setForm({
          ...form,
        }),
      );
      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.ACCOUNT_IMPORT_SETUP);
    }),
  submitAccountForm: form =>
    withErrorToast(async (dispatch, getState) => {
      const phrase = await utilCryptoService.mnemonicGenerate(12);
      const isAdvancedOptionsValid = await validateAdvancedOptionsForm({
        phrase,
        form,
      });

      if (!isAdvancedOptionsValid) {
        return;
      }

      dispatch(accountActions.setAccountToBackup(null));
      dispatch(createAccountActions.setForm(form));
      dispatch(createAccountActions.setMnemonicPhrase(phrase));
      navigate(Routes.CREATE_ACCOUNT_BACKUP);
    }),
  createAccount: ({
    hasBackup = false,
    successMessage = translate('account_setup.success'),
    form: extraForm,
  } = {}) =>
    withErrorToast(async (dispatch, getState) => {
      const state = getState();
      const phrase = createAccountSelectors.getMnemonicPhrase(state);
      const form = {
        ...createAccountSelectors.getForm(state),
        ...extraForm,
      };

      console.log('call create account', phrase);
      console.log('form', form);
      let {accountName, keypairType, derivationPath} = form;

      if (!form.json) {
        const account = await Wallet.getInstance().accounts.create({
          mnemonic: phrase,
          name: accountName,
          type: keypairType,
          derivationPath: derivationPath,
        });

        console.log(account);
      } else {
        await Wallet.getInstance().accounts.create({
          json: form.json,
          password: form.password,
        });
      }

      navigate(Routes.ACCOUNTS);
      showToast({
        message: successMessage,
      });
    }),
};

export const createAccountReducer = createAccount.reducer;
