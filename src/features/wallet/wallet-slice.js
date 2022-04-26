import {createSlice} from '@reduxjs/toolkit';
import {Keychain} from '../../core/keychain';
import {navigate, navigateBack} from '../../core/navigation';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {Routes} from '../../core/routes';
import {appSelectors, BiometryType} from '../app/app-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  accountActions,
  accountOperations,
  exportFile,
} from '../accounts/account-slice';
import RNFS from 'react-native-fs';
import {showConfirmationModal} from 'src/components/ConfirmationModal';
import {translate} from 'src/locales';
import {showToast, withErrorToast} from 'src/core/toast';
import {Logger} from 'src/core/logger';
import {clearCacheData} from '../../core/realm';
import Clipboard from '@react-native-community/clipboard';
import {pickDocuments} from '../../core/storage-utils';

const initialState = {
  loading: true,
  passcode: null,
  creationFlags: {},
};

const wallet = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setPasscode(state, action) {
      state.passcode = action.payload;
    },
    setWalletInfo(state, action) {
      state.walletInfo = action.payload;
    },
    setCreationFlags(state, action) {
      state.creationFlags = action.payload;
    },
  },
});

export const walletActions = wallet.actions;

const getRoot = state => state.wallet;

export const walletSelectors = {
  getLoading: state => getRoot(state).loading,
  getPasscode: state => getRoot(state).passcode,
  getWalletInfo: state => getRoot(state).walletInfo,
  getCreationFlags: state => getRoot(state).creationFlags || {},
};

export const verifyJSONCredentialFormat = walletJSONData => {
  const walletDataKeys = Object.keys(walletJSONData);

  const mustHaveKeys = [
    '@context',
    'type',
    'credentialSubject',
    'issuer',
    'issuanceDate',
  ];
  for (const singleMustKey of mustHaveKeys) {
    if (!walletDataKeys.includes(singleMustKey)) {
      return false;
    }
  }
  return true;
};

export async function validateWalletImport(fileData, password) {
  let jsonData;

  try {
    jsonData = JSON.parse(fileData);
    if (!verifyJSONCredentialFormat(jsonData)) {
      throw new Error(translate('import_wallet.invalid_file'));
    }
  } catch (err) {
    console.error(err);
    throw new Error(translate('import_wallet.invalid_file'));
  }

  try {
    await WalletRpc.remove('wallet');
    await clearCacheData();
    await AsyncStorage.removeItem('wallet');
    await WalletRpc.create('wallet');
    await WalletRpc.load();
    await WalletRpc.sync();
  } catch (err) {
    console.error(err);
  }
  return jsonData;
}

export async function importWallet(jsonData, password) {
  try {
    await WalletRpc.importWallet(jsonData, password);
  } catch (err) {
    console.error(err);
    throw new Error(translate('import_wallet.import_error'));
  }

  const docs = await WalletRpc.query({});
  if (Array.isArray(docs) && docs.length > 0) {
    const accounts = docs.filter(doc => doc.type === 'Account');

    if (accounts.length === 0) {
      throw new Error(translate('import_wallet.invalid_file'));
    }

    const warnings = [];

    for (let account of accounts) {
      const correlationDocs = account.correlation.map(docId =>
        docs.find(doc => doc.id === docId),
      );
      const hasMnemonic = correlationDocs.find(doc => doc.type === 'Mnemonic');
      const hasKeyPair = correlationDocs.find(doc => doc.type === 'KeyPair');

      if (!hasMnemonic && !hasKeyPair) {
        warnings.push(`keypair not found for account ${account.id}`);

        await WalletRpc.update({
          ...account,
          meta: {
            ...account.meta,
            readOnly: true,
            keypairNotFoundWarning: true,
          },
        });
      }
    }
  } else {
    throw new Error(translate('import_wallet.invalid_file'));
  }
}
async function validateAndImport(fileData, password) {
  const jsonData = await validateWalletImport(fileData, password);
  await importWallet(jsonData, password);
}

export const walletOperations = {
  pickWalletBackup: () =>
    withErrorToast(async (dispatch, getState) => {
      const files = await pickDocuments();

      if (!files.length) {
        return;
      }

      navigate(Routes.WALLET_IMPORT_BACKUP_PASSWORD, {
        fileUri: files[0].fileCopyUri,
      });
    }),

  importFromClipboard: () =>
    withErrorToast(async (dispatch, getState) => {
      const fileData = await Clipboard.getString();

      navigate(Routes.WALLET_IMPORT_BACKUP_PASSWORD, {
        fileData,
      });
    }),
  importWallet: ({fileUri, password, fileData}) =>
    withErrorToast(async (dispatch, getState) => {
      try {
        if (fileUri) {
          try {
            fileUri = fileUri.replace(/%20/gi, ' ');
            fileData = await RNFS.readFile(fileUri);
          } catch (err) {
            console.error(err);

            throw new Error('Unable to read file');
          }
        }
        await validateAndImport(fileData, password);
      } catch (err) {
        console.error(err);
        showToast({
          message: err.message,
          type: 'error',
          duration: 5000,
        });

        navigate(Routes.CREATE_WALLET);
        return;
      }

      dispatch(
        walletActions.setCreationFlags({
          importWalletFlow: true,
        }),
      );

      navigate(Routes.CREATE_WALLET_PASSCODE);
    }),
  exportWallet: ({password, callback}) =>
    withErrorToast(async (dispatch, getState) => {
      try {
        await WalletRpc.load();
      } catch (err) {
        console.log(err);
      }
      const walletBackup = await WalletRpc.export(password);
      const jsonData = JSON.stringify(walletBackup);
      const path = `${
        RNFS.DocumentDirectoryPath
      }/walletBackup-${Date.now()}.json`;
      const mimeType = 'application/json';
      await RNFS.writeFile(path, jsonData);

      exportFile({
        path,
        mimeType,
        errorMessage: translate('backup_wallet.error'),
      });

      if (callback) {
        callback();
      } else {
        navigateBack();
      }
    }),
  deleteWallet: () =>
    withErrorToast(async (dispatch, getState) => {
      await clearCacheData();
      dispatch(accountActions.clearAccounts());
      await AsyncStorage.removeItem('walletInfo');
      await AsyncStorage.removeItem('wallet');
      await WalletRpc.create('wallet');
      dispatch(walletActions.setWalletInfo(null));
      navigate(Routes.CREATE_WALLET);
    }),
  confirmWalletDelete: () => async (dispatch, getState) => {
    const confirmRemoval = () =>
      showConfirmationModal({
        type: 'alert',
        title: translate('delete_wallet_confirmation.title'),
        description: translate('delete_wallet_confirmation.message'),
        confirmText: translate('delete_wallet_confirmation.confirm'),
        cancelText: translate('delete_wallet_confirmation.cancel'),
        onConfirm: () => {
          dispatch(walletOperations.deleteWallet());
        },
      });

    const confirmWalletBackup = () =>
      showConfirmationModal({
        type: 'info',
        title: translate('backup_wallet_confirmation.title'),
        description: translate('backup_wallet_confirmation.message'),
        confirmText: translate('backup_wallet_confirmation.confirm'),
        cancelText: translate('backup_wallet_confirmation.cancel'),
        onConfirm: () => {
          navigate(Routes.WALLET_EXPORT_BACKUP, {
            callback() {
              navigate(Routes.APP_SETTINGS);
              confirmRemoval();
            },
          });
        },
        onCancel: confirmRemoval,
      });

    navigate(Routes.CONFIRM_WALLET_ACCESS, {
      callback() {
        navigate(Routes.APP_SETTINGS);
        confirmWalletBackup();
      },
    });
  },
  unlockWallet:
    ({biometry, passcode, callback} = {}) =>
    async (dispatch, getState) => {
      const keychainId = 'wallet';

      if (biometry) {
        Logger.debug('Biometry: attempt to unlock');
        const result = await Keychain.getItem(`${keychainId}-biometric`, {
          authenticationPrompt: {
            title: 'Allow dock wallet to use your biometry',
          },
        });

        Logger.debug('Biometry unlock succeed');
        Logger.debug(JSON.stringify(result));
      } else {
        const keychainData = await Keychain.getItem(keychainId);

        if (keychainData.passcode !== passcode) {
          throw new Error({
            code: 401,
            message: "Passcode doesn't match, please try again",
          });
        }
      }

      if (callback) {
        callback();
      } else {
        dispatch(accountOperations.loadAccounts());
        navigate(Routes.ACCOUNTS);
      }
    },

  createWallet:
    ({biometry = false} = {}) =>
    async (dispatch, getState) => {
      const passcode = walletSelectors.getPasscode(getState());
      const flags = walletSelectors.getCreationFlags(getState());
      const keychainId = 'wallet';
      const keychainProps = {
        passcode: passcode.toString(),
      };

      if (biometry) {
        const biometryType = appSelectors.getSupportedBiometryType(getState());

        if (biometryType === BiometryType.Fingerprint) {
          await Keychain.setItem(`${keychainId}-biometric`, keychainProps, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            authenticationType: Keychain.BIOMETRY_TYPE.FINGERPRINT,
            storage: Keychain.STORAGE_TYPE.RSA,
          });
        } else {
          await Keychain.setItem(`${keychainId}-biometric`, keychainProps, {
            accessControl:
              Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
          });
        }

        Logger.debug('Biometry created');

        await Keychain.getItem(`${keychainId}-biometric`, {
          authenticationPrompt: {
            title: 'Allow dock wallet to use your biometry',
          },
        });
      }

      await Keychain.setItem(keychainId, keychainProps, {});
      const walletInfo = {
        biometry,
      };
      await AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo));

      await Keychain.getItem(keychainId);

      dispatch(walletActions.setWalletInfo(walletInfo));

      if (!flags.importWalletFlow) {
        await WalletRpc.create(keychainId);
      }

      dispatch(walletActions.setCreationFlags({}));

      navigate(Routes.ACCOUNTS);
    },
};

export const walletReducer = wallet.reducer;
