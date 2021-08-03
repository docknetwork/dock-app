import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {navigate, navigationRef} from './navigation';
import {Routes} from './routes';

import {CreateWalletScreen} from '../features/wallet/CreateWalletScreen';
import {CreatePasscodeContainer} from '../features/wallet/CreatePasscodeScreen';
import {ProtectYourWalletContainer} from '../features/wallet/ProtectYourWalletScreen';
import {SetupPasscodeScreen} from '../features/wallet/SetupPasscodeScreen';
import {AccountsContainer} from '../features/accounts/AccountsScreen';
import {AccountDetailsContainer} from '../features/accounts/AccountDetailsScreen';
import {SplashScreen} from '../features/app/SplashScreen';
import {AppSettingsContainer} from '../features/app/AppSettingsScreen';
import {ImportAccountFromMnemonicContainer} from '../features/accounts/ImportAccountFromMnemonicScreen';
import {ImportAccountSetupContainer} from '../features/accounts/ImportAccountSetupScreen';
import {ImportAccountPasswordContainer} from '../features/accounts/ImportAccountPasswordScreen';

// POC Screens
import {Icon, View} from 'native-base';
import {Platform, TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../theme/colors';
import {SettingsScreen} from '../features/settings/SettingsScreen';
import {CredentialListScreen} from '../features/credentials/CredentialListScreen';
import {CredIssuanceScreen} from '../features/credential-issuance/CredIssuaneScreen';
import {QRScanScreen} from '../features/qr-code-scanner/QRScanScreen';
import {SendTokensScreen} from '../features/transactions/SendTokensScreen';
import {CreateBackupScreen} from '../features/wallet-backup/CreateBackupScreen';
import {LoadBackupScreen} from '../features/wallet-backup/LoadBackupScreen';
import {CreateWalletMnemonicScreen} from '../features/wallets/CreateWalletMnemonicScreen';
import {UnlockWalletScreen} from '../features/wallets/UnlockWalletScreen';
import {HomeScreen} from '../features/home/HomeScreen';
import {PresentationExchangeScreen} from '../features/credentials/PresentationExchangeScreen';
import {DIDListScreen} from '../features/did/DIDListScreen';
import {UnlockWalletContainer} from '../features/unlock-wallet/UnlockWalletScreen';

import {CreateAccountVerifyPhraseContainer} from '../features/account-creation/CreateAccountVerifyPhraseScreen';
import {CreateAccountSetupContainer} from '../features/account-creation/CreateAccountSetupScreen';
import {CreateAccountMnemonicContainer} from '../features/account-creation/CreateAccountMnemonicScreen';
import {CreateAccountBackupContainer} from '../features/account-creation/CreateAccountBackupScreen';
import { ExportAccountPasswordContainer } from '../features/accounts/ExportAccountPasswordScreen';
import {ExportWalletContainer} from '../features/wallet/ExportWalletScreen';
import {ImportWalletContainer} from '../features/wallet/ImportWalletScreen';
import {ImportWalletPasswordContainer} from '../features/wallet/ImportWalletPasswordScreen';

const getMainOptions = opts => {
  return {
    headerStyle: {
      backgroundColor: Colors.darkBlue,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitle: 'Back',
    headerRight: () => (
      <React.Fragment>
        <View style={{flexDirection: 'row', paddingRight: 10}}>
          <View style={{marginRight: 12}}>
            <TouchableWithoutFeedback
              onPress={() => navigate(Routes.APP_QR_SCANNER)}>
              <Icon size={30} name="scan-outline" style={{color: '#fff'}} />
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback
            onPress={() => navigate(Routes.APP_SETTINGS)}>
            <Icon size={30} name="settings" style={{color: '#fff'}} />
          </TouchableWithoutFeedback>
        </View>
      </React.Fragment>
    ),
    ...opts,
  };
};

const AppStack = createStackNavigator();
const RootStack = createStackNavigator();

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const screenOptions = {
  headerShown: false,
}

if (Platform.OS === 'android') {
  screenOptions.cardStyleInterpolator = forFade;
}

function AppStackScreen() {
  return (
    <AppStack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: '#222',
        },
        cardOverlay: () => 
          <View
            style={{
            flex: 1,
            backgroundColor: '#222',
          }} />
      }}
    >
      <AppStack.Screen
        name={Routes.SPLASH_SCREEN}
        component={SplashScreen}
        options={{
          ...screenOptions,
          
          gestureEnabled: false,
          
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET}
        component={CreateWalletScreen}
        options={{
          ...screenOptions,
          gestureEnabled: false,
          
        }}
      />
      <AppStack.Screen
        name={Routes.APP_SETTINGS}
        component={AppSettingsContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
          
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE_SETUP}
        component={SetupPasscodeScreen}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_FROM_MNEMONIC}
        component={ImportAccountFromMnemonicContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_SETUP}
        component={ImportAccountSetupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.ACCOUNT_IMPORT_SETUP_PASSWORD}
        component={ImportAccountPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />
      
      <AppStack.Screen
        name={Routes.ACCOUNT_EXPORT_SETUP_PASSWORD}
        component={ExportAccountPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />
      
      

      <AppStack.Screen
        name={Routes.CREATE_WALLET_PASSCODE}
        component={CreatePasscodeContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_PROTECT}
        component={ProtectYourWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
      <AppStack.Screen
        name={Routes.UNLOCK_WALLET}
        component={UnlockWalletContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNTS}
        component={AccountsContainer}
        options={{
          ...screenOptions,
          gestureEnabled: false,
        }}
      />
      <AppStack.Screen
        name={Routes.ACCOUNT_DETAILS}
        component={AccountDetailsContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_SETUP}
        component={CreateAccountSetupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_MNEMONIC}
        component={CreateAccountMnemonicContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_BACKUP}
        component={CreateAccountBackupContainer}
        options={{
          ...screenOptions,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_ACCOUNT_VERIFY_PHRASE}
        component={CreateAccountVerifyPhraseContainer}
        options={{
          ...screenOptions,
        }}
      />
      
      
      <AppStack.Screen
        name={Routes.WALLET_EXPORT_BACKUP}
        component={ExportWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
      
      <AppStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP}
        component={ImportWalletContainer}
        options={{
          ...screenOptions,
        }}
      />
      
      <AppStack.Screen
        name={Routes.WALLET_IMPORT_BACKUP_PASSWORD}
        component={ImportWalletPasswordContainer}
        options={{
          ...screenOptions,
        }}
      />
    </AppStack.Navigator>
  );
}

export function NavigationRouter() {
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
