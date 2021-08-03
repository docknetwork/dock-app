import {Button, Pressable, Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {navigate, navigateBack} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {
  AlertIcon,
  BackButton,
  Box,
  Content,
  DotsVerticalIcon,
  Header,
  LoadingScreen,
  NBox,
  ScreenContainer,
  Text,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {accountOperations, accountSelectors} from './account-slice';
import {AccountSettingsModal} from './AccountSettingsModal';
import {QRCodeModal} from './QRCodeModal';

export function AccountDetailsScreen({
  account,
  onSend,
  onReceive,
  onDelete,
  onBackup,
  onEdit,
  onExport,
  qrCodeData,
}) {
  const [accountSettingsVisible, setAccountSettingsVisible] = useState();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState();

  useEffect(() => {
    if (!!qrCodeData) {
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
            <BackButton />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">{account.meta.name}</Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end">
            <Pressable onPress={() => setAccountSettingsVisible(true)}>
              <DotsVerticalIcon width="22px" height="22px" />
            </Pressable>
          </NBox>
        </Box>
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Stack
          direction="column"
          alignItems="center"
          backgroundColor={Theme.colors.secondaryBackground}
          p="32px"
          borderRadius={8}>
          <PolkadotIcon address={account.id} size={48} />
          <Typography
            variant="h1"
            fontSize="32px"
            mt={3}>
            {account.meta.balance.value} {account.meta.balance.symbol}
          </Typography>
          <Typography
            variant="montserrat"
            fontSize={14}
            fontWeight={500}
          >
            0.00 USD
          </Typography>
          <Stack direction="row" width="100%" mt={5}>
            <Button flex={1} size="sm">
              {translate('account_details.send_tokens_btn')}
            </Button>
            <Button ml={2} flex={1} size="sm">
              {translate('account_details.receive_tokens_btn')}
            </Button>
          </Stack>
        </Stack>

        <Stack mt={8}>
          <NBox borderBottomColor={Theme.colors.dividerBackground} borderBottomWidth={0.5} pb={4}>
            <Typography variant="h2">
              {translate('account_details.transactions')}
            </Typography>
          </NBox>
          <NBox mt={8}>
            <Typography variant="list-description">
              {translate('account_details.empty_transacions_msg')}
            </Typography>
          </NBox>
        </Stack>

        {account.meta.hasBackup ? null : (
          <Stack backgroundColor="rgba(120, 53, 15, 0.3)" p={'16px'} mt={20}>
            <Stack direction="row">
              <NBox mr={3} mt={'3px'}>
                <AlertIcon />
              </NBox>
              <Typography
                ml={2}
                variant="h3"
                fontSize={17}
              >
                {translate('account_details.pending_backup')}
              </Typography>
            </Stack>
            <NBox mt={2}>
              <Typography color="background: rgba(254, 243, 199, 1)">
                {translate('account_details.backup_details')}
              </Typography>
            </NBox>
            <Button
              onPress={onBackup}
              mt={4}
              alignSelf="flex-start"
              size="sm"
              backgroundColor="rgba(120, 53, 15, 1)">
              {translate('account_details.backup_btn')}
            </Button>
          </Stack>
        )}
      </Content>
      <AccountSettingsModal
        visible={accountSettingsVisible}
        onClose={() => setAccountSettingsVisible(false)}
        onDelete={onDelete}
        onExport={onExport}
      />
      <QRCodeModal
        data={qrCodeData}
        title={translate('account_details.export_account')}
        description={translate('account_details.export_account_description')}
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

  if (!account) {
    return <LoadingScreen />;
  }

  return (
    <AccountDetailsScreen
      onDelete={() => {
        return dispatch(accountOperations.removeAccount(accountId)).then(
          navigateBack,
        );
      }}
      onEdit={() => {
        alert('edit');
      }}
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
