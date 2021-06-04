import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {CreateWalletScreen} from '../features/wallets/CreateWalletScreen';
import {CreateWalletMnemonicScreen} from '../features/wallets/CreateWalletMnemonicScreen';
import {navigate, navigationRef} from './navigation';
import {Routes} from './routes';
import {useDispatch} from 'react-redux';
import {UnlockWalletScreen} from '../features/wallets/UnlockWalletScreen';
import {HomeScreen} from '../features/home/HomeScreen';
import {PresentationExchangeScreen} from '../features/credentials/PresentationExchangeScreen';
import {DIDListScreen} from '../features/did/DIDListScreen';
import {Icon, View} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../theme/colors';
import {SettingsScreen} from '../features/settings/SettingsScreen';
import {CredentialListScreen} from '../features/credentials/CredentialListScreen';
import {CredIssuanceScreen} from '../features/credential-issuance/CredIssuaneScreen';
import {QRScanScreen} from '../features/qr-code-scanner/QRScanScreen';
import {SendTokensScreen} from '../features/transactions/SendTokensScreen';
import {CreateBackupScreen} from '../features/wallet-backup/CreateBackupScreen';
import {LoadBackupScreen} from '../features/wallet-backup/LoadBackupScreen';

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

function AppStackScreen() {
  return (
    <AppStack.Navigator>
      
      <AppStack.Screen
        name={Routes.UNLOCK_WALLET}
        component={UnlockWalletScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.BACKUP_CREATE}
        component={CreateBackupScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.BACKUP_LOAD}
        component={LoadBackupScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_SEND_TOKENS}
        component={SendTokensScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_PRESENTATION_EXCHANGE}
        component={PresentationExchangeScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_CREDENTIAL_ISSUANCE}
        component={CredIssuanceScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_QR_SCANNER}
        component={QRScanScreen}
        options={{
          headerShown: false,
        }}
      />

      <AppStack.Screen
        name={Routes.CREATE_WALLET}
        component={CreateWalletScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.CREATE_WALLET_MNEMONIC}
        component={CreateWalletMnemonicScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={Routes.APP_HOME}
        component={HomeScreen}
        options={{
          ...getMainOptions({
            title: 'Welcome',
            headerLeft: null,
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_DID}
        component={DIDListScreen}
        options={{
          ...getMainOptions({
            title: 'DIDs',
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_CREDENTIAL}
        component={CredentialListScreen}
        options={{
          ...getMainOptions({
            title: 'Credentials',
          }),
        }}
      />
      <AppStack.Screen
        name={Routes.APP_SETTINGS}
        component={SettingsScreen}
        options={{
          ...getMainOptions({
            title: 'Settings',
            headerRight: null,
          }),
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
