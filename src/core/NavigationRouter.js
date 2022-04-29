import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'native-base';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {
  MenuCredentialsIcon,
  MenuScanQRIcon,
  MenuSettingsIcon,
  MenuTokensIcon,
  Theme,
} from 'src/design-system';
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
import {QRScanScreen} from '../features/qr-code-scanner/QRScanScreen';
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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {translate} from '../locales';
import {useSelector} from 'react-redux';
import {authenticationSelectors} from '../features/unlock-wallet/unlock-wallet-slice';

const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TokenStack = createStackNavigator();
const CredentialStack = createStackNavigator();
const QRScanStack = createStackNavigator();
const AppSettingStack = createStackNavigator();

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
function AppSettingStackScreen() {
  return (
    <AppSettingStack.Navigator>
      <AppSettingStack.Screen
        name={Routes.APP_SETTINGS}
        component={AppSettingsContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppSettingStack.Screen
        name={Routes.WALLET_EXPORT_BACKUP}
        component={ExportWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppSettingStack.Screen
        {...getScreenProps({
          name: Routes.DEV_SETTINGS,
          component: DevSettingsContainer,
        })}
      />
    </AppSettingStack.Navigator>
  );
}
function QRStackStackScreen() {
  return (
    <QRScanStack.Navigator>
      <QRScanStack.Screen
        {...getScreenProps({
          name: Routes.APP_QR_SCANNER,
          component: QRScanScreen,
          options: {
            gestureEnabled: false,
          },
        })}
      />
    </QRScanStack.Navigator>
  );
}
function CredentialStackScreen() {
  return (
    <CredentialStack.Navigator>
      <CredentialStack.Screen
        {...getScreenProps({
          name: Routes.APP_CREDENTIALS,
          component: CredentialsContainer,
          options: {
            gestureEnabled: false,
          },
        })}
      />
    </CredentialStack.Navigator>
  );
}
function TokensStackScreen() {
  return (
    <TokenStack.Navigator initialRouteName={Routes.ACCOUNTS}>
      <TokenStack.Screen
        options={{
          ...screenOptions,
        }}
        name={Routes.ACCOUNTS}
        component={AccountsContainer}
      />
      <TokenStack.Screen
        name={Routes.ACCOUNT_DETAILS}
        component={AccountDetailsContainer}
        options={{
          ...screenOptions,
        }}
      />
      <TokenStack.Screen
        name={Routes.TOKEN_SEND}
        component={SendTokenContainer}
        options={{
          ...screenOptions,
        }}
      />
      <TokenStack.Screen
        name={Routes.TOKEN_RECEIVE}
        component={ReceiveTokenContainer}
        options={{
          ...screenOptions,
        }}
      />
      <TokenStack.Screen
        name={Routes.TRADE_BUY_DOCK}
        component={BuyDockScreenContainer}
        options={{
          ...screenOptions,
        }}
      />
      <TokenStack.Screen
        name={Routes.CREATE_ACCOUNT_SETUP}
        component={CreateAccountSetupContainer}
        options={{
          ...screenOptions,
        }}
      />
      <TokenStack.Screen
        name={Routes.CREATE_ACCOUNT_BACKUP}
        component={CreateAccountBackupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <TokenStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_FROM_MNEMONIC,
          component: ImportAccountFromMnemonicContainer,
        })}
      />
      <TokenStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP,
          component: ImportAccountSetupContainer,
        })}
      />

      <TokenStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_IMPORT_SETUP_PASSWORD,
          component: ImportAccountPasswordContainer,
        })}
      />

      <TokenStack.Screen
        {...getScreenProps({
          name: Routes.ACCOUNT_EXPORT_SETUP_PASSWORD,
          component: ExportAccountPasswordContainer,
        })}
      />

      <TokenStack.Screen
        {...getScreenProps({
          name: Routes.CREATE_WALLET_PROTECT,
          component: ProtectYourWalletContainer,
        })}
      />
    </TokenStack.Navigator>
  );
}
export function NavigationRouter() {
  const isLoggedIn = useSelector(authenticationSelectors.isLoggedIn);
  console.log(isLoggedIn, 'isLoggedIn');
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          backBehavior={'history'}
          screenOptions={{
            tabBarStyle: {
              backgroundColor: Theme.colors.primaryBackground,
              borderTopColor: Theme.colors.primaryBackground,
            },
          }}>
          <Tab.Screen
            {...getScreenProps({
              name: Routes.ACCOUNTS,
              component: TokensStackScreen,
              options: {
                tabBarLabel: translate('app_navigation.tokens'),
                tabBarIcon: ({color, size}) => (
                  <MenuTokensIcon style={{color: color}} />
                ),
              },
            })}
          />
          <Tab.Screen
            {...getScreenProps({
              name: Routes.APP_CREDENTIALS,
              component: CredentialStackScreen,
              options: {
                tabBarLabel: translate('app_navigation.credentials'),
                tabBarIcon: ({color, size}) => (
                  <MenuCredentialsIcon style={{color: color}} />
                ),
              },
            })}
          />
          <Tab.Screen
            {...getScreenProps({
              name: Routes.APP_QR_SCANNER,
              component: QRStackStackScreen,
              options: {
                tabBarLabel: translate('app_navigation.scan'),
                tabBarIcon: ({color, size}) => (
                  <MenuScanQRIcon style={{color: color}} />
                ),
              },
            })}
          />
          <Tab.Screen
            {...getScreenProps({
              name: Routes.APP_SETTINGS,
              component: AppSettingStackScreen,
              options: {
                tabBarLabel: translate('app_navigation.settings'),
                tabBarIcon: ({color, size}) => (
                  <MenuSettingsIcon style={{color: color}} />
                ),
              },
            })}
          />
        </Tab.Navigator>
      ) : (
        <AppStack.Navigator>
          <AppStack.Group
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
                name: Routes.CREATE_WALLET_PASSCODE_SETUP,
                component: SetupPasscodeScreen,
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
                name: Routes.UNLOCK_WALLET,
                component: UnlockWalletContainer,
                options: {
                  gestureEnabled: false,
                },
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
          </AppStack.Group>
          <AppStack.Group
            screenOptions={{
              cardStyle: {
                backgroundColor: Theme.colors.primaryBackground,
              },
              cardOverlay: () => <View style={styles.cardOverlay} />,
            }}>
            <AppStack.Screen
              {...getScreenProps({
                name: Routes.CREATE_ACCOUNT_MNEMONIC,
                component: CreateAccountMnemonicContainer,
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
                name: Routes.CONFIRM_WALLET_ACCESS,
                component: UnlockWalletContainer,
              })}
            />
          </AppStack.Group>
        </AppStack.Navigator>
      )}
    </NavigationContainer>
  );
}
