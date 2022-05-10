import {
  parseTransaction,
  sortTransactions,
  transactionsOperations,
} from './transactions-slice';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {getRealm} from '../../core/realm';

const mockStore = configureMockStore([thunk]);
describe('transactions-slice', () => {
  it('expect to parse transaction', () => {
    const t1 = {
      date: new Date(),
    };

    const t2 = {
      date: new Date().toString(),
    };

    expect(parseTransaction(t1)).toBe(t1);
    expect(parseTransaction(t2).date).toBeInstanceOf(Date);
  });

  it('expect to sort transactions', () => {
    const baseTime = Date.now();
    const t1 = {
      date: new Date(baseTime + 1000),
    };

    const t2 = {
      date: new Date(baseTime + 2000),
    };

    const t3 = {
      date: new Date(baseTime + 3000),
    };

    const t4 = {
      date: new Date(baseTime + 4000),
    };

    const list = [t2, t1, t3, t4];
    const sorted = list.sort(sortTransactions);

    expect(sorted[0]).toBe(t4);
    expect(sorted[1]).toBe(t3);
    expect(sorted[2]).toBe(t2);
    expect(sorted[3]).toBe(t1);
  });

  it('Test if realm delete is called', () => {
    const initialState = {
      app: {
        networkId: 'testnet',
        devSettingsEnabled: true,
      },
      wallet: {},
      account: {},
      createAccount: {},
      qrCode: {},
      transactions: {
        loading: false,
        transactions: [],
      },
    };

    const store = mockStore(initialState);

    const realm = getRealm();
    return store
      .dispatch(
        transactionsOperations.sendTransaction({
          recipientAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
          accountAddress: '4C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
          amount: 1,
          fee: 1,
        }),
      )
      .then(() => {
        expect(realm.delete.mock.calls.length).toBe(1);
      });
  });
});
