import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {Linking, Platform, StyleSheet} from 'react-native';
import {Theme} from 'src/design-system';
import {ReceiveTokenContainer} from 'src/features/tokens/ReceiveTokenScreen';
import {SendTokenContainer} from 'src/features/tokens/SendTokenScreen';
import {CreateAccountBackupContainer} from '../features/account-creation/CreateAccountBackupScreen';
import {CreateAccountMnemonicContainer} from '../features/account-creation/CreateAccountMnemonicScreen';
import {CreateAccountSetupContainer} from '../features/account-creation/CreateAccountSetupScreen';
import {CreateAccountVerifyPhraseContainer} from '../features/account-creation/CreateAccountVerifyPhraseScreen';
import {AccountDetailsContainer} from '../features/accounts/AccountDetailsScreen';
import {AccountsContainer} from '../features/accounts/AccountsScreen';
import {ExportAccountPasswordContainer} from '../features/accounts/ExportAccountPasswordScreen';
import {ImportAccountFromMnemonicContainer} from '../features/accounts/ImportAccountFromMnemonicScreen';
import {ImportAccountPasswordContainer} from '../features/accounts/ImportAccountPasswordScreen';
import {ImportAccountSetupContainer} from '../features/accounts/ImportAccountSetupScreen';
import {AppSettingsContainer} from '../features/app/AppSettingsScreen';
import {SplashScreen} from '../features/app/SplashScreen';
import {QRScanContainer} from '../features/qr-code-scanner/QRScanScreen';
import {UnlockWalletContainer} from '../features/unlock-wallet/UnlockWalletScreen';
import {CreatePasscodeContainer} from '../features/wallet/CreatePasscodeScreen';
import {CreateWalletScreen} from '../features/wallet/CreateWalletScreen';
import {ExportWalletContainer} from '../features/wallet/ExportWalletScreen';
import {ImportWalletPasswordContainer} from '../features/wallet/ImportWalletPasswordScreen';
import {ImportWalletContainer} from '../features/wallet/ImportWalletScreen';
import {ProtectYourWalletContainer} from '../features/wallet/ProtectYourWalletScreen';
import {SetupPasscodeScreen} from '../features/wallet/SetupPasscodeScreen';
import {DevSettingsContainer} from '../features/dev-settings/DevSettingsScreen';
import {BuyDockScreenContainer} from '../features/trade/BuyDockScreen';
import {navigationRef} from './navigation';
import {Routes} from './routes';
import {CredentialsContainer} from '../features/credentials/CredentialsScreen';
import {withNavigationContext} from './NavigationContext';
import DeepLinking from 'react-native-deep-linking';
import {isDidAuthUrl} from '../features/qr-code-scanner/qr-code';
import {navigate} from './navigation';
import {DIDAuthScreenContainer} from '../features/didManagement/DIDAuthScreen';
import {authenticationSelectors} from '../features/unlock-wallet/unlock-wallet-slice';
import {useSelector} from 'react-redux';

const AppStack = createStackNavigator();
const RootStack = createStackNavigator();

const forFade = ({current, closing}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const screenOptions = {
  headerShown: false,
};

if (Platform.OS === 'android') {
  screenOptions.cardStyleInterpolator = forFade;
}

const styles = StyleSheet.create({
  cardOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.primaryBackground,
  },
});

const getScreenProps = ({component, options = {}, name, tab}) => {
  return {
    component: withNavigationContext(component),
    name: name,
    initialParams: {
      currentTab: tab,
    },
    options: {
      ...screenOptions,
      ...options,
    },
  };
};

function AppStackScreen() {
  return (
    <AppStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: Theme.colors.primaryBackground,
        },
        cardOverlay: () => <View style={styles.cardOverlay} />,
      }}>
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.SPLASH_SCREEN,
          component: SplashScreen,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_WALLET,
          component: CreateWalletScreen,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.APP_SETTINGS,
          component: AppSettingsContainer,
          options: {
            gestureEnabled: false,
          },
          tab: 'settings',
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_WALLET_PASSCODE_SETUP,
          component: SetupPasscodeScreen,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_FROM_MNEMONIC,
          component: ImportAccountFromMnemonicContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP,
          component: ImportAccountSetupContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP_PASSWORD,
          component: ImportAccountPasswordContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_EXPORT_SETUP_PASSWORD,
          component: ExportAccountPasswordContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_WALLET_PASSCODE,
          component: CreatePasscodeContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_WALLET_PROTECT,
          component: ProtectYourWalletContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.UNLOCK_WALLET,
          component: UnlockWalletContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNTS,
          component: AccountsContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_DETAILS,
          component: AccountDetailsContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.TRADE_BUY_DOCK,
          component: BuyDockScreenContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.APP_QR_SCANNER,
          component: QRScanContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.APP_DID_AUTH,
          component: DIDAuthScreenContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_SETUP,
          component: CreateAccountSetupContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.DEV_SETTINGS,
          component: DevSettingsContainer,
          tab: 'settings',
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_MNEMONIC,
          component: CreateAccountMnemonicContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_BACKUP,
          component: CreateAccountBackupContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_ACCOUNT_VERIFY_PHRASE,
          component: CreateAccountVerifyPhraseContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.WALLET_EXPORT_BACKUP,
          component: ExportWalletContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.WALLET_IMPORT_BACKUP,
          component: ImportWalletContainer,
        })}
      />

      <AppStack.Screen
        {...getScreenProps({
          name: Routes.WALLET_IMPORT_BACKUP_PASSWORD,
          component: ImportWalletPasswordContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_RECEIVE,
          component: ReceiveTokenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.TOKEN_SEND,
          component: SendTokenContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.CONFIRM_WALLET_ACCESS,
          component: UnlockWalletContainer,
        })}
      />
      <AppStack.Screen
        {...getScreenProps({
          name: Routes.APP_CREDENTIALS,
          component: CredentialsContainer,
          tab: 'credentials',
        })}
      />
    </AppStack.Navigator>
  );
}

export function NavigationRouter() {
  const isLoggedIn = useSelector(authenticationSelectors.isLoggedIn);

  const navigateToDIDAuthScreen = useCallback(
    url => {
      if (isLoggedIn) {
        navigate(Routes.APP_DID_AUTH, {
          dockWalletAuthDeepLink: url,
        });
      } else {
        navigate(Routes.UNLOCK_WALLET, {
          callback: () => {
            navigate(Routes.APP_DID_AUTH, {
              dockWalletAuthDeepLink: url,
            });
          },
        });
      }
    },
    [isLoggedIn],
  );
  useEffect(() => {
    const getAsyncURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl !== undefined && initialUrl != null) {
        navigateToDIDAuthScreen(initialUrl);
      }
    };

    getAsyncURL();
  }, [navigateToDIDAuthScreen]);

  const handleUrl = useCallback(
    ({url}) => {
      if (isDidAuthUrl(url)) {
        navigateToDIDAuthScreen(url);
      }
    },
    [navigateToDIDAuthScreen],
  );
  useEffect(() => {
    DeepLinking.addScheme('dockwallet://');
    Linking.addEventListener('url', handleUrl);

    return () => {
      Linking.removeEventListener('url', handleUrl);
    };
  }, [handleUrl]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="app"
          component={AppStackScreen}
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
