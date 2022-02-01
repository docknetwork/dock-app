import {createSlice} from '@reduxjs/toolkit';
import {translate} from 'src/locales';
import {ApiRpc} from '@docknetwork/wallet-sdk-core/lib/client/api-rpc';
import uuid from 'uuid';
import {getRealm} from 'src/core/realm';
import {showToast} from 'src/core/toast';
import {DOCK_TOKEN_UNIT} from 'src/core/format-utils';
import {appSelectors} from '../app/app-slice';
import {fetchTransactions} from '../../core/subscan';
import {accountSelectors} from '../accounts/account-slice';
import BigNumber from 'bignumber.js';

export const TransactionStatus = {
  InProgress: 'pending',
  Failed: 'failed',
  Complete: 'complete',
};

const initialState = {
  loading: false,
  transactions: [],
};

export const parseTransaction = transaction =>
  transaction.date instanceof Date
    ? transaction
    : {
        ...transaction,
        date: new Date(transaction.date),
      };

export const sortTransactions = (a, b) => b.date.getTime() - a.date.getTime();

const transactions = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTransactions(state, action) {
      state.transactions = action.payload
        .map(parseTransaction)
        .sort(sortTransactions);
    },
    addTransaction(state, action) {
      state.transactions.push(parseTransaction(action.payload));
      state.transactions = state.transactions.sort(sortTransactions);
    },
    updateTransaction(state, action) {
      state.transactions = state.transactions.map(item => {
        if (item.id === action.payload.id) {
          return parseTransaction(action.payload);
        }

        return item;
      });
    },
  },
});

export const transactionsActions = transactions.actions;

const getRoot = state => state.transactions;

export const transactionsSelectors = {
  getLoading: state => getRoot(state).loading,
  getTransactions: state => getRoot(state).transactions,
};

export const transactionsOperations = {
  loadExternalTransactions: account => async (dispatch, getState) => {
    const realm = getRealm();
    const dbTransactions = realm.objects('Transaction').toJSON();

    const handleTransaction = tx => {
      if (tx.from !== account && tx.to !== account) {
        return;
      }

      if (dbTransactions.find(item => item.hash === tx.hash)) {
        return;
      }

      const newTx = {
        amount: BigNumber(tx.amount).times(DOCK_TOKEN_UNIT).toString(),
        feeAmount: tx.fee,
        recipientAddress: tx.to,
        fromAddress: tx.from,
        id: tx.hash,
        hash: tx.hash,
        network: 'mainnet',
        status: 'complete',
        date: new Date(parseInt(tx.block_timestamp + '000', 10)),
      };

      realm.write(() => {
        realm.create('Transaction', newTx, 'modified');
      });
    };

    let data;
    let page = 0;

    do {
      data = await fetchTransactions({address: account, page});
      data.transfers.forEach(handleTransaction);
      page++;
    } while (data.hasNextPage);
  },
  loadTransactions: () => async (dispatch, getState) => {
    const realm = getRealm();
    const networkId = appSelectors.getNetworkId(getState());
    let items = realm.objects('Transaction').toJSON();

    dispatch(transactionsActions.setTransactions(items));

    if (networkId === 'mainnet') {
      const accounts = accountSelectors.getAccounts(getState());

      for (const account of accounts) {
        try {
          await dispatch(
            transactionsOperations.loadExternalTransactions(account.id),
          );
        } catch (err) {
          console.error(err);
        }
      }
    }

    items = realm.objects('Transaction').toJSON();

    if (networkId === 'mainnet') {
      items = items.filter(item => !(item.status === 'complete' && !item.hash));
    }

    dispatch(transactionsActions.setTransactions(items));
  },
  updateTransaction: transaction => async (dispatch, getState) => {
    const realm = getRealm();

    realm.write(() => {
      realm.create('Transaction', transaction, 'modified');
    });

    dispatch(transactionsActions.updateTransaction(transaction));
  },

  getFeeAmount:
    ({recipientAddress, accountAddress, amount}) =>
    async (dispatch, getState) => {
      return ApiRpc.getFeeAmount({
        recipientAddress: recipientAddress,
        accountAddress,
        amount: amount,
      });
    },

  sendTransaction:
    ({recipientAddress, accountAddress, amount, fee, prevTransaction}) =>
    async (dispatch, getState) => {
      showToast({
        message: translate('send_token.transaction_sent'),
      });

      const parsedAmount = parseFloat(amount) * DOCK_TOKEN_UNIT;

      const internalId = uuid();
      const transaction = {
        id: internalId,
        date: new Date().toISOString(),
        fromAddress: accountAddress,
        recipientAddress: recipientAddress,
        amount: `${parsedAmount}`,
        feeAmount: `${fee}`,
        status: TransactionStatus.InProgress,
      };

      const realm = getRealm();

      realm.write(() => {
        realm.create('Transaction', transaction, 'modified');
      });

      dispatch(transactionsActions.addTransaction(transaction));

      showToast({
        type: 'success',
        message: translate('confirm_transaction.transfer_initiated'),
      });

      ApiRpc.sendTokens({
        recipientAddress,
        accountAddress,
        amount: parsedAmount,
      })
        .then(res => {
          const updatedTransation = {
            ...transaction,
            status: TransactionStatus.Complete,
          };
          dispatch(transactionsActions.updateTransaction(updatedTransation));

          realm.write(() => {
            realm.create('Transaction', updatedTransation, 'modified');
          });

          showToast({
            type: 'success',
            message: translate('confirm_transaction.transaction_complete'),
          });

          if (
            prevTransaction &&
            prevTransaction.status === TransactionStatus.Failed
          ) {
            dispatch(
              transactionsOperations.updateTransaction({
                ...prevTransaction,
                retrySucceed: true,
              }),
            );
          }
        })
        .catch(err => {
          console.error(err);

          showToast({
            type: 'error',
            message: translate('transaction_failed.title'),
          });

          const updatedTransation = {
            ...transaction,
            status: TransactionStatus.Failed,
          };

          realm.write(() => {
            realm.create('Transaction', updatedTransation, 'modified');
          });

          dispatch(transactionsActions.updateTransaction(updatedTransation));
        });
    },
};

export const transactionsReducer = transactions.reducer;
