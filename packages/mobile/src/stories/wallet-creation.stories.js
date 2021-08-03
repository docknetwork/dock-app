import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {CreatePasscodeScreen} from '../features/wallet/CreatePasscodeScreen';
import {CreateWalletScreen} from '../features/wallet/CreateWalletScreen';
import {SetupPasscodeScreen} from '../features/wallet/SetupPasscodeScreen';
import {ProtectYourWalletScreen} from '../features/wallet/ProtectYourWalletScreen';

storiesOf('Wallet creation', module)
  .add('Create Wallet', () => <CreateWalletScreen />)
  .add('Setup Passcode', () => <SetupPasscodeScreen />)
  .add('Create Passcode', () => <CreatePasscodeScreen text="Create your passcode" />)
  .add('Protect your wallet', () => <ProtectYourWalletScreen />);
