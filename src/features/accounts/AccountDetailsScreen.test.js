import {shallow} from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import {
  AccountDetailsScreen,
  filterTransactionHistory,
  sortTransactionHistory,
} from './AccountDetailsScreen';

const mockStore = configureMockStore();

describe('AccountDetailsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <AccountDetailsScreen
        account={{
          meta: {
            name: 'Test account',
            balance: 0,
          },
        }}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  describe('expect transactions to be sorted by date in descending order', () => {
    const address1 = '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';
    const address2 = '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';

    const txSent = {
      id: 0,
      amount: '1',
      fromAddress: address1,
      recipientAddress: address2,
      status: 'complete',
      date: '2022-03-03T17:52:03.741Z',
    };

    const txReceived = {
      id: 2,
      amount: '1',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'complete',
      date: '2022-01-03T17:52:03.741Z',
    };

    const txSent2 = {
      id: 1,
      amount: '2',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'complete',
      date: '2022-02-03T17:52:03.741Z',
    };
    const sortedTrans = sortTransactionHistory([txSent, txReceived, txSent2]);
    expect(sortedTrans[0].id).toBe(0);
    expect(sortedTrans[1].id).toBe(1);
    expect(sortedTrans[2].id).toBe(2);
  });
  describe('expect to filter transaction history items', () => {
    const address1 = '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';
    const address2 = '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB';
    const txSent = {
      amount: '1',
      fromAddress: address1,
      recipientAddress: address2,
      status: 'complete',
    };
    const txReceived = {
      amount: '1',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'complete',
    };
    const txReceivedFailed = {
      amount: '1',
      fromAddress: address2,
      recipientAddress: address1,
      status: 'failed',
    };
    const txOtherAddress = {
      amount: '1',
      fromAddress: 'someOtherAddress',
      recipientAddress: 'someOtherAddress',
      status: 'complete',
    };

    it('expect to hide received transactions with failed status', () => {
      const transactions = filterTransactionHistory(
        [txReceived, txReceivedFailed],
        address1,
      );
      expect(transactions.length).toBe(1);
    });

    it('expect to add sent flag', () => {
      const transactions = filterTransactionHistory(
        [txReceived, txSent],
        address1,
      );
      expect(transactions[0].sent).toBe(false);
      expect(transactions[1].sent).toBe(true);
    });

    it('expect to filter only transactions for the given address', () => {
      const transactions = filterTransactionHistory(
        [txOtherAddress, txSent],
        address1,
      );
      expect(transactions.length).toBe(1);
    });
  });
});
