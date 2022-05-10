import {Button, Pressable, ScrollView, Stack} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {RefreshControl} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {formatCurrency, formatDate} from 'src/core/format-utils';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  AlertIcon,
  RetryIcon,
  BackButton,
  Box,
  DotsVerticalIcon,
  Header,
  LoadingScreen,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {TokenAmount} from '../tokens/ConfirmTransactionModal';
import {TransactionConfirmationModal} from '../transactions/TransactionConfirmationModal';
import {TransactionDetailsModal} from '../transactions/TransactionDetailsModal';
import {
  transactionsOperations,
  transactionsSelectors,
  TransactionStatus,
} from '../transactions/transactions-slice';
import {accountOperations, accountSelectors} from './account-slice';
import {AccountSettingsModal} from './AccountSettingsModal';
import {QRCodeModal} from './QRCodeModal';
import {addTestId} from '../../core/automation-utils';
import {appSelectors} from '../app/app-slice';
import {useFeatures} from '../app/feature-flags';
import uuid from 'uuid';
import {displayWarning} from './AccountsScreen';

const TRANSACTION_FILTERS = {
  all: 'all',
  sent: 'sent',
  received: 'received',
  failed: 'failed',
};

function TransactionHistoryItem({transaction, accountAddress}) {
  const [showDetails, setShowDetails] = useState();
  const [showConfirmation, setShowConfirmation] = useState();

  const {amount, sent} = transaction;

  const transactionAmountVariant = useMemo(() => {
    if (sent) {
      return 'transaction-filter-amount-sent';
    } else if (transaction.status === TransactionStatus.Complete) {
      return 'transaction-filter-amount-received';
    }
    return 'transaction-filter-amount-failed';
  }, [sent, transaction.status]);

  return (
    <>
      <TransactionConfirmationModal
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        transaction={transaction}
      />
      <TransactionDetailsModal
        visible={showDetails}
        onClose={() => setShowDetails(false)}
        transaction={transaction}
        accountAddress={accountAddress}
      />

      <TouchableHighlight
        onPress={() => {
          setShowDetails(true);
        }}>
        <Stack direction={'row'} py={4}>
          <Stack direction={'column'} flex={1}>
            <Typography variant="transaction-type-label">
              {translate(`transaction_details.${sent ? 'sent' : 'received'}`)}{' '}
            </Typography>
            <Typography variant={'transaction-item-date'}>
              {formatDate(transaction.date)}
            </Typography>

            {transaction.status === TransactionStatus.Failed &&
            !transaction.retrySucceed ? (
              <Stack alignItems="flex-start">
                <Button
                  startIcon={<RetryIcon />}
                  variant={'transactionRetry'}
                  size="xs"
                  whiteBtn
                  onPress={() => setShowConfirmation(true)}>
                  <Typography variant={'transactionRetryTxt'}>
                    {translate('transaction_history.try_again')}
                  </Typography>
                </Button>
              </Stack>
            ) : null}
          </Stack>
          <Stack direction={'column'}>
            <TokenAmount amount={amount}>
              {({tokenAmount, tokenSymbol, fiatAmount, fiatSymbol}) => (
                <>
                  <Typography variant={transactionAmountVariant}>
                    {sent ? '-' : ''}
                    {tokenAmount} {tokenSymbol}
                  </Typography>
                  <Typography variant={'transaction-item-fiat-amount'}>
                    {formatCurrency(fiatAmount)} {fiatSymbol}
                  </Typography>
                </>
              )}
            </TokenAmount>
          </Stack>
        </Stack>
      </TouchableHighlight>
      <NBox
        borderBottomColor={Theme.colors.tertiaryBackground}
        borderBottomWidth={0.5}
      />
    </>
  );
}

export function filterTransactionHistory(
  transactions,
  accountAddress,
  filter = 'all',
) {
  return transactions
    .map(item => ({
      ...item,
      sent: item.fromAddress === accountAddress,
    }))
    .filter(item => {
      const receivedFailed =
        !item.sent && item.status === TransactionStatus.Failed;
      return !receivedFailed;
    })
    .filter(item => {
      if (filter === TRANSACTION_FILTERS.all) {
        return true;
      }
      if (filter === TRANSACTION_FILTERS.sent) {
        return !!item.sent;
      }
      if (filter === TRANSACTION_FILTERS.received) {
        return !item.sent;
      }
      if (filter === TRANSACTION_FILTERS.failed) {
        return item.status === TransactionStatus.Failed;
      }
      return true;
    });
}

function TransactionHistory({accountAddress}) {
  const allTransactions = useSelector(transactionsSelectors.getTransactions);
  const [activeFilter, setActiveFilter] = useState(TRANSACTION_FILTERS.all);
  const networkId = useSelector(appSelectors.getNetworkId);
  const {features} = useFeatures();
  const transactions = useMemo(() => {
    return filterTransactionHistory(
      allTransactions,
      accountAddress,
      activeFilter,
    );
  }, [allTransactions, accountAddress, activeFilter]);

  if (networkId !== 'mainnet' && !features.showTestnetTransaction) {
    return (
      <NBox>
        <Typography variant="list-description">
          {translate('account_details.no_transactions_on_testnet', {
            networkId,
          })}
        </Typography>
      </NBox>
    );
  }

  return (
    <NBox>
      <Stack direction="row" my={3}>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.all);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.all}
          variant={'transactionFilter'}
          size={'xs'}>
          <Typography
            variant="transaction-filter"
            color={
              activeFilter === TRANSACTION_FILTERS.all
                ? Theme.colors.activeText
                : Theme.colors.inactiveText
            }>
            {translate('transaction_details.all')}
          </Typography>
        </Button>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.sent);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.sent}
          variant={'transactionFilter'}
          size={'xs'}>
          <Typography
            variant="transaction-filter"
            color={
              activeFilter === TRANSACTION_FILTERS.sent
                ? Theme.colors.activeText
                : Theme.colors.inactiveText
            }>
            {translate('transaction_details.sent')}
          </Typography>
        </Button>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.received);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.received}
          size={'xs'}
          variant={'transactionFilter'}>
          <Typography
            variant="transaction-filter"
            color={
              activeFilter === TRANSACTION_FILTERS.received
                ? Theme.colors.activeText
                : Theme.colors.inactiveText
            }>
            {translate('transaction_details.received')}
          </Typography>
        </Button>
        <Button
          onPress={() => {
            setActiveFilter(TRANSACTION_FILTERS.failed);
          }}
          isActive={activeFilter === TRANSACTION_FILTERS.failed}
          size={'xs'}
          variant={'transactionFilter'}>
          <Typography
            variant="transaction-filter"
            color={
              activeFilter === TRANSACTION_FILTERS.failed
                ? Theme.colors.activeText
                : Theme.colors.inactiveText
            }>
            {translate('transaction_history.failed')}
          </Typography>
        </Button>
      </Stack>

      {transactions.length > 0 ? (
        transactions.map(item => {
          return (
            <TransactionHistoryItem
              key={item.id}
              transaction={item}
              accountAddress={accountAddress}
            />
          );
        })
      ) : (
        <NBox>
          <Typography variant="list-description">
            {translate('account_details.empty_transacions_msg')}
          </Typography>
        </NBox>
      )}
    </NBox>
  );
}

export function AccountDetailsScreen({
  account,
  onSend,
  onReceive,
  onDelete,
  onBackup,
  onEdit,
  onExport,
  qrCodeData,
  onRefresh,
  isRefreshing,
  showTransak,
}) {
  const [accountSettingsVisible, setAccountSettingsVisible] = useState();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState();

  useEffect(() => {
    setQrCodeModalVisible(!!qrCodeData);
  }, [qrCodeData]);

  return (
    <ScreenContainer testID="AccountDetailsScreen">
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton onPress={() => navigate(Routes.ACCOUNTS)} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">{account.name}</Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end">
            <Pressable
              onPress={() => setAccountSettingsVisible(true)}
              _pressed={{
                opacity: Theme.touchOpacity,
              }}>
              <DotsVerticalIcon width="22px" height="22px" />
            </Pressable>
          </NBox>
        </Box>
      </Header>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        <Stack mx={5} flex={1}>
          <Stack mx={3} direction="column" alignItems="center">
            <Stack direction="column" alignItems="center" mt={8}>
              <PolkadotIcon address={account.id} size={48} />
              <TokenAmount amount={account.balance}>
                {({fiatAmount, tokenAmount, tokenSymbol}) => (
                  <>
                    <Typography variant="h1" fontSize="32px" mt={6}>
                      {tokenAmount} {tokenSymbol}
                    </Typography>
                    <Typography variant="fiat-amount" mt={1}>
                      {formatCurrency(fiatAmount)}
                    </Typography>
                  </>
                )}
              </TokenAmount>
            </Stack>

            <Stack direction="row" width="100%" mt={9} mb={7}>
              <Button
                mr={1}
                flex={1}
                size="xs"
                {...addTestId('SendTokensBtn')}
                disabled={account.readOnly}
                onPress={() =>
                  navigate(Routes.TOKEN_SEND, {
                    address: account.id,
                  })
                }>
                <Typography color={Theme.button.textColor}>
                  {translate('account_details.send_tokens_btn')}
                </Typography>
              </Button>
              <Button
                ml={1}
                mr={1}
                flex={1}
                size="xs"
                {...addTestId('ReceiveTokensBtn')}
                onPress={() =>
                  navigate(Routes.TOKEN_RECEIVE, {
                    address: account.id,
                  })
                }>
                <Typography color={Theme.button.textColor}>
                  {translate('account_details.receive_tokens_btn')}
                </Typography>
              </Button>
              {showTransak ? (
                <Button
                  ml={1}
                  flex={1}
                  size="xs"
                  {...addTestId('BuyDockBtn')}
                  onPress={() =>
                    navigate(Routes.TRADE_BUY_DOCK, {
                      id: account.id,
                      orderId: uuid(),
                    })
                  }>
                  <Typography color={Theme.button.textColor}>
                    {translate('account_details.buy')}
                  </Typography>
                </Button>
              ) : null}
            </Stack>
          </Stack>
          {!displayWarning(account) ? null : (
            <Stack
              backgroundColor={Theme.colors.warningBackground}
              p={'16px'}
              mt={5}>
              <Stack direction="row">
                <NBox mr={3} mt={'3px'}>
                  <AlertIcon />
                </NBox>
                <Typography ml={2} variant="h3" fontSize={17}>
                  {translate('account_details.pending_backup')}
                </Typography>
              </Stack>
              <NBox mt={2}>
                <Typography color={Theme.colors.warningText}>
                  {translate('account_details.backup_details')}
                </Typography>
              </NBox>
              <Button
                onPress={onBackup}
                {...addTestId('BackupBtn')}
                mt={4}
                alignSelf="flex-start"
                size="sm"
                backgroundColor="rgba(120, 53, 15, 1)">
                {translate('account_details.backup_btn')}
              </Button>
            </Stack>
          )}
          {account.meta && account.meta.keypairNotFoundWarning ? (
            <Stack
              backgroundColor={Theme.colors.warningBackground}
              p={'16px'}
              mt={5}>
              <Stack direction="row">
                <NBox mr={3} mt={'3px'}>
                  <AlertIcon />
                </NBox>
                <Typography ml={2} variant="h3" fontSize={17}>
                  Keypair not found
                </Typography>
              </Stack>
              <NBox mt={2}>
                <Typography color={Theme.colors.warningText}>
                  Please remove this account and import it from a json file or
                  QR Code
                </Typography>
              </NBox>
            </Stack>
          ) : null}
          <Stack mt={3}>
            <NBox
              borderBottomColor={Theme.colors.tertiaryBackground}
              borderBottomWidth={0.5}
              pb={2}
              pr={0}
              pl={0}>
              <Typography variant="h2">
                {translate('account_details.transactions')}
              </Typography>
            </NBox>
            <NBox>
              <TransactionHistory accountAddress={account.id} />
            </NBox>
          </Stack>
        </Stack>
      </ScrollView>
      <AccountSettingsModal
        visible={accountSettingsVisible}
        onClose={() => setAccountSettingsVisible(false)}
        account={account}
        onDelete={onDelete}
        onExport={onExport}
      />
      <QRCodeModal
        data={qrCodeData}
        title={translate('account_details.export_account')}
        description={translate('account_details.export_account_description')}
        {...addTestId('ExportAccountDescription')}
        visible={qrCodeModalVisible}
        onClose={() => {
          navigate(Routes.ACCOUNT_DETAILS, {
            id: account.id,
            qrCodeData: null,
          });
        }}
      />
    </ScreenContainer>
  );
}

export function AccountDetailsContainer({route}) {
  const {id: accountId, qrCodeData} = route.params;
  const dispatch = useDispatch();
  const account = useSelector(accountSelectors.getAccountById(accountId));
  const {features} = useFeatures();

  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(accountOperations.fetchAccountBalance(account.id)).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    dispatch(transactionsOperations.loadTransactions(accountId));
  }, [dispatch, accountId]);

  if (!account) {
    return <LoadingScreen />;
  }

  return (
    <AccountDetailsScreen
      onDelete={() => {
        return dispatch(accountOperations.removeAccount({id: accountId})).then(
          () => navigate(Routes.ACCOUNTS),
        );
      }}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      showTransak={features.activate_transak}
      onBackup={() => {
        return dispatch(accountOperations.backupAccount(account));
      }}
      qrCodeData={qrCodeData}
      account={account}
      onExport={method => {
        navigate(Routes.ACCOUNT_EXPORT_SETUP_PASSWORD, {
          method,
          accountId,
        });
      }}
    />
  );
}
