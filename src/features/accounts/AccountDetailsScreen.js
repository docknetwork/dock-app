import {Button, Pressable, ScrollView, Stack} from 'native-base';
import React, {useEffect, useMemo, useState} from 'react';
import {RefreshControl} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {formatCurrency, formatDate} from 'src/core/format-utils';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {navigate, navigateBack} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  AlertIcon,
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

const TransactionStatusColor = {
  pending: Theme.colors.transactionPending,
  failed: Theme.colors.transactionFailed,
  complete: Theme.colors.transactionCompleted,
};

function TransactionHistoryItem({transaction, accountAddress}) {
  const [showDetails, setShowDetails] = useState();
  const [showConfirmation, setShowConfirmation] = useState();

  const {amount, sent} = transaction;

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

      <Stack
        pb={2}
        borderBottomWidth={1}
        borderBottomColor={Theme.colors.tertiaryBackground}>
        <TouchableHighlight
          onPress={() => {
            setShowDetails(true);
          }}>
          <Stack>
            <TokenAmount amount={amount}>
              {({tokenAmount, tokenSymbol}) => (
                <Typography variant="h3">
                  {translate(
                    `transaction_details.${sent ? 'sent' : 'received'}`,
                  )}{' '}
                  {tokenAmount} {tokenSymbol}
                </Typography>
              )}
            </TokenAmount>
            <Typography>{formatDate(transaction.date)}</Typography>

            <Stack direction="row">
              <Stack
                my={2}
                direction="row"
                bg={Theme.colors.secondaryBackground}
                borderRadius={Theme.borderRadius * 2}
                px={3}
                w="auto">
                <Stack
                  bg={TransactionStatusColor[transaction.status]}
                  w={2}
                  h={2}
                  borderRadius={10}
                  mt={2}
                  mr={2}
                />
                <Typography>
                  {translate(
                    `transaction_status.${transaction.status || 'pending'}`,
                  )}
                </Typography>
              </Stack>
              <Stack flex={1} />
            </Stack>
          </Stack>
        </TouchableHighlight>
        {transaction.status === TransactionStatus.Failed &&
        !transaction.retrySucceed ? (
          <Stack alignItems="flex-start">
            <Button
              colorScheme="dark"
              variant="solid"
              size="sm"
              onPress={() => setShowConfirmation(true)}>
              {translate('transaction_history.try_again')}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}
export function sortTransactionHistory(transactions) {
  return [...transactions].sort((a, b) => {
    const aDateTime = a.date
      ? new Date(a.date).getTime()
      : new Date().getTime();
    const bDateTime = b.date
      ? new Date(b.date).getTime()
      : new Date().getTime();
    return bDateTime - aDateTime;
  });
}

export function filterTransactionHistory(transactions, accountAddress) {
  return transactions
    .filter(
      item =>
        item.fromAddress === accountAddress ||
        item.recipientAddress === accountAddress,
    )
    .map(item => ({
      ...item,
      sent: item.fromAddress === accountAddress,
    }))
    .filter(item => {
      const receivedFailed =
        !item.sent && item.status === TransactionStatus.Failed;
      return !receivedFailed;
    });
}

function TransactionHistory({accountAddress}) {
  const allTransactions = useSelector(transactionsSelectors.getTransactions);

  const transactions = useMemo(() => {
    const filteredTransactions = filterTransactionHistory(
      allTransactions,
      accountAddress,
    );
    return sortTransactionHistory(filteredTransactions);
  }, [allTransactions, accountAddress]);

  return useMemo(() => {
    if (!transactions.length) {
      return (
        <NBox>
          <Typography variant="list-description">
            {translate('account_details.empty_transacions_msg')}
          </Typography>
        </NBox>
      );
    }

    return (
      <NBox>
        {transactions.map(item => (
          <TransactionHistoryItem
            key={item.id}
            transaction={item}
            accountAddress={accountAddress}
          />
        ))}
      </NBox>
    );
  }, [transactions, accountAddress]);
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
}) {
  const [accountSettingsVisible, setAccountSettingsVisible] = useState();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState();

  useEffect(() => {
    if (qrCodeData) {
      setQrCodeModalVisible(true);
    }
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
        <Stack mx={26} flex={1}>
          <Stack
            direction="column"
            alignItems="center"
            backgroundColor={Theme.colors.secondaryBackground}
            p="32px"
            borderRadius={8}>
            <PolkadotIcon address={account.id} size={48} />
            <TokenAmount amount={account.balance}>
              {({fiatAmount, fiatSymbol, tokenAmount, tokenSymbol}) => (
                <>
                  <Typography variant="h1" fontSize="32px" mt={3}>
                    {tokenAmount} {tokenSymbol}
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(fiatAmount)}
                  </Typography>
                </>
              )}
            </TokenAmount>

            <Stack direction="row" width="100%" mt={5}>
              <Button
                flex={1}
                size="sm"
                {...addTestId('SendTokensBtn')}
                disabled={account.readOnly}
                onPress={() =>
                  navigate(Routes.TOKEN_SEND, {
                    address: account.id,
                  })
                }>
                {translate('account_details.send_tokens_btn')}
              </Button>
              <Button
                ml={2}
                flex={1}
                size="sm"
                {...addTestId('ReceiveTokensBtn')}
                onPress={() =>
                  navigate(Routes.TOKEN_RECEIVE, {
                    address: account.id,
                  })
                }>
                {translate('account_details.receive_tokens_btn')}
              </Button>
            </Stack>
          </Stack>
          {account.hasBackup ? null : (
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
          <Stack mt={8}>
            <NBox
              borderBottomColor={Theme.colors.tertiaryBackground}
              borderBottomWidth={0.5}
              pb={4}>
              <Typography variant="h2">
                {translate('account_details.transactions')}
              </Typography>
            </NBox>
            <NBox mt={3}>
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
        onClose={() => setQrCodeModalVisible(false)}
      />
    </ScreenContainer>
  );
}

export function AccountDetailsContainer({route}) {
  const {id: accountId, qrCodeData} = route.params;
  const dispatch = useDispatch();
  const account = useSelector(accountSelectors.getAccountById(accountId));
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(accountOperations.fetchAccountBalance(account.id)).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    dispatch(transactionsOperations.loadTransactions());
  }, [dispatch]);

  if (!account) {
    return <LoadingScreen />;
  }

  return (
    <AccountDetailsScreen
      onDelete={() => {
        return dispatch(accountOperations.removeAccount({id: accountId})).then(
          navigateBack,
        );
      }}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
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
