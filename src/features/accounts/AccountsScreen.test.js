import React from 'react';
import {shallow} from 'enzyme';
import {AccountsScreen, displayWarning} from './AccountsScreen';
import {renderAppProviders} from '../../core/test-utils';

const mockAccounts = [
  {
    id: 'test',
    name: 'Account name',
    balance: 21,
  },
];

describe('AccountsScreen', () => {
  it('should render correctly with no accounts', () => {
    const tree = shallow(renderAppProviders(<AccountsScreen accounts={[]} />));
    expect(tree.dive()).toMatchSnapshot();
  });

  it('should render correctly with accounts', () => {
    const tree = shallow(
      renderAppProviders(<AccountsScreen accounts={mockAccounts} />),
    );
    expect(tree.dive()).toMatchSnapshot();
  });

  it('should show warning symbol', () => {
    expect(true).toEqual(
      displayWarning({
        id: 'test',
        name: 'Account name',
        balance: 21,
      }),
    );

    expect(false).toEqual(
      displayWarning({
        '@context': ['https://w3id.org/wallet/v1'],
        balance: '0',
        correlation: ['5f274200-9e9e-4fea-87e2-ab5045b8e21e'],
        derivationPath: '',
        hasBackup: true,
        id: '3HAZ9oQx9eJgy7M2r4X6wPcCV2W438xMpXJjmFsqEwDm4BNu',
        keypairType: 'sr25519',
        meta: {
          balance: 0,
          derivationPath: '',
          hasBackup: true,
          keypairType: 'sr25519',
          name: 'Account_1',
        },
        name: 'Account_1',
        type: 'Account',
      }),
    );

    expect(true).toEqual(
      displayWarning({
        '@context': ['https://w3id.org/wallet/v1'],
        balance: '0',
        correlation: ['5f274200-9e9e-4fea-87e2-ab5045b8e21e'],
        derivationPath: '',
        hasBackup: false,
        id: '3HAZ9oQx9eJgy7M2r4X6wPcCV2W438xMpXJjmFsqEwDm4BNu',
        keypairType: 'sr25519',
        meta: {
          balance: 0,
          derivationPath: '',
          hasBackup: true,
          keypairType: 'sr25519',
          name: 'Account_1',
        },
        name: 'Account_1',
        type: 'Account',
      }),
    );
    expect(true).toEqual(
      displayWarning({
        '@context': ['https://w3id.org/wallet/v1'],
        balance: '0',
        correlation: ['5f274200-9e9e-4fea-87e2-ab5045b8e21e'],
        derivationPath: '',
        hasBackup: true,
        id: '3HAZ9oQx9eJgy7M2r4X6wPcCV2W438xMpXJjmFsqEwDm4BNu',
        keypairType: 'sr25519',
        meta: {
          balance: 0,
          derivationPath: '',
          hasBackup: true,
          keypairType: 'sr25519',
          name: 'Account_1',
          keypairNotFoundWarning: true,
        },
        name: 'Account_1',
        type: 'Account',
      }),
    );
  });
});
