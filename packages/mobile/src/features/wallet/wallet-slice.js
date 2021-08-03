import {createSlice} from '@reduxjs/toolkit';
import {Keychain} from '../../core/keychain';
import {navigate, navigateBack} from '../../core/navigation';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import DocumentPicker from 'react-native-document-picker';
import {Routes} from '../../core/routes';
import {appSelectors, BiometryType} from '../app/app-slice';
import AsyncStorage from '@react-native-community/async-storage';
import {accountOperations} from '../accounts/account-slice';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {showToast} from '../../core/toast';
import {showConfirmationModal} from 'src/components/ConfirmationModal';
import { translate } from 'src/locales';

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
  pickWalletBackup: () => async (dispatch, getState) => {
    const file = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    navigate(Routes.WALLET_IMPORT_BACKUP_PASSWORD, {
      fileUri: file.fileCopyUri,
    });
  },
  importWallet:
    ({fileUri, password}) =>
    async (dispatch, getState) => {
      const fileData = await RNFS.readFile(fileUri);
      const jsonData = JSON.parse(fileData);
      await AsyncStorage.removeItem('wallet');
      await WalletRpc.importWallet(jsonData, password);
      
      dispatch(walletActions.setCreationFlags({
        importWalletFlow: true,
      }));
      
      navigate(Routes.CREATE_WALLET_PASSCODE);      
    },
  exportWallet:
    ({password, callback }) =>
    async (dispatch, getState) => {
      const walletBackup = await WalletRpc.export(password);
      const jsonData = JSON.stringify(walletBackup);
      const path = `${RNFS.DocumentDirectoryPath}/walletBackup.json`;
      const mimeType = 'application/json';
      await RNFS.writeFile(path, jsonData);

      try {
        await Share.open({
          url: 'file://' + path,
          type: mimeType,
        });
        
        if (callback) {
          callback();
        } else {
          navigateBack()
        }
      } catch (err) {
        console.error(err);
        showToast({
          message: translate('backup_wallet.error'),
          type: 'error',
        });
      }

      RNFS.unlink(path);
    },
  deleteWallet: () => async (dispatch, getState) => {
    await AsyncStorage.removeItem('walletInfo');
    await AsyncStorage.removeItem('wallet');
    await WalletRpc.create('wallet');
    dispatch(walletActions.setWalletInfo(null));
    navigate(Routes.CREATE_WALLET);
  },
  confirmWalletDelete: () => async (dispatch, getState) => {
    const confirmRemoval = () =>
      showConfirmationModal({
        type: 'alert',
        title: translate('delete_wallet_confirmation.title'),
        description: translate('delete_wallet_confirmation.description'),
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
        description: translate('backup_wallet_confirmation.description'),
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

    navigate(Routes.UNLOCK_WALLET, {
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
        await Keychain.getItem(`${keychainId}-biometric`, {
          authenticationPrompt: {
            title: 'Allow dock wallet to use your biometry',
          },
        });
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

      const keychainData = await Keychain.getItem(keychainId);

      dispatch(walletActions.setWalletInfo(walletInfo));

      if (!flags.importWalletFlow) {
        WalletRpc.create(keychainId);
      }

      dispatch(walletActions.setCreationFlags({}))

      navigate(Routes.ACCOUNTS);
    },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const walletReducer = wallet.reducer;
