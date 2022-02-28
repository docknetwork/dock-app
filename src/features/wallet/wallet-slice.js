import {createSlice} from '@reduxjs/toolkit';
import {Keychain} from '../../core/keychain';
import {navigate, navigateBack} from '../../core/navigation';
// import {WalletRpc} from '@docknetwork/wallet-sdk-core/lib/services/wallet';
import DocumentPicker from 'react-native-document-picker';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {Routes} from '../../core/routes';
import {appSelectors, BiometryType} from '../app/app-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {accountOperations, exportFile} from '../accounts/account-slice';
import RNFS from 'react-native-fs';
import {showConfirmationModal} from 'src/components/ConfirmationModal';
import {translate} from 'src/locales';
import {showToast} from 'src/core/toast';
import {Logger} from 'src/core/logger';
import {withErrorToast} from 'src/core/toast';

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

export const walletOperations = {
  pickWalletBackup: () =>
    withErrorToast(async (dispatch, getState) => {
      const files = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      navigate(Routes.WALLET_IMPORT_BACKUP_PASSWORD, {
        fileUri: files[0].fileCopyUri,
      });
    }),
  importWallet: ({fileUri, password}) =>
    withErrorToast(async (dispatch, getState) => {
      fileUri = fileUri.replace(/%20/gi, ' ');
      const fileData = await RNFS.readFile(fileUri);
      const jsonData = JSON.parse(fileData);
      await WalletRpc.remove('wallet');
      await AsyncStorage.removeItem('wallet');
      await WalletRpc.create('wallet');
      await WalletRpc.load();
      await WalletRpc.sync();
      await WalletRpc.importWallet(jsonData, password);

      const accounts = await WalletRpc.query({
        equals: {
          'content.type': 'Account',
        },
      });

      if (!accounts || !accounts.length) {
        showToast({
          message: translate('import_wallet.invalid_file'),
          type: 'error',
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
      const walletBackup = await WalletRpc.export(password);
      const jsonData = JSON.stringify(walletBackup);
      const path = `${RNFS.DocumentDirectoryPath}/walletBackup.json`;
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
        // dispatch(accountOperations.loadAccounts());
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
        // await WalletRpc.create(keychainId);
      }

      dispatch(walletActions.setCreationFlags({}));

      navigate(Routes.ACCOUNTS);
    },
};

export const walletReducer = wallet.reducer;
