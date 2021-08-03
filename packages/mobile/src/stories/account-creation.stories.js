import {storiesOf} from '@storybook/react-native';
import React from 'react';
import { CreateAccountSetupScreen } from '../features/account-creation/CreateAccountSetupScreen';
import { CreateAccountBackupScreen } from '../features/account-creation/CreateAccountBackupScreen';
import { CreateAccountMnemonicScreen } from '../features/account-creation/CreateAccountMnemonicScreen';
import { CreateAccountVerifyPhraseScreen } from '../features/account-creation/CreateAccountVerifyPhraseScreen';

storiesOf('Account creation', module)
  .add('1. Account name', () => <CreateAccountSetupScreen />)
  .add('2. Account Back up', () => <CreateAccountBackupScreen />)
  .add('3. Recovery phrase', () => <CreateAccountMnemonicScreen />)
  .add('4. Verify phrase', () => <CreateAccountVerifyPhraseScreen />)
  
  
  
  
  
  
  
  



