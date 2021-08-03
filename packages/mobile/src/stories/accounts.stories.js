import {storiesOf} from '@storybook/react-native';
import React from 'react';
import { AccountsScreen } from '../features/accounts/AccountsScreen';

storiesOf('Accounts', module)
  .add('Accounts list', () => <AccountsScreen />)



