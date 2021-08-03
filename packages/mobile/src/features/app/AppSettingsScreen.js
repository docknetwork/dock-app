import React from 'react';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  NBox,
  BackButton,
  OptionList,
  DownloadIcon,
  TrashIcon,
} from '../../design-system';
import {useDispatch} from 'react-redux';
import {AppConstants} from './constants';
import {walletOperations} from '../wallet/wallet-slice';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';
import { translate } from 'src/locales';

const constants = AppConstants.settings;

export function AppSettingsScreen({onDeleteWallet, onBackupWallet}) {
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
            <Typography variant="h3">
              {
                translate('settings.title')
              }
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <Content>
        <OptionList
          mx={5}
          items={[
            {
              testID: constants.testID.backupWalletOption,
              title: translate('settings.backup_wallet'),
              icon: <DownloadIcon />,
              onPress: onBackupWallet,
            },
            {
              testID: constants.testID.deleteWalletOption,
              title: translate('settings.delete_wallet'),
              icon: <TrashIcon />,
              onPress: onDeleteWallet,
            },
          ]}
        />
      </Content>
    </ScreenContainer>
  );
}

export function AppSettingsContainer() {
  const dispatch = useDispatch();

  return (
    <AppSettingsScreen
      onDeleteWallet={() => {
        return dispatch(walletOperations.confirmWalletDelete());
      }}
      onBackupWallet={() => {
        navigate(Routes.WALLET_EXPORT_BACKUP)
      }}
    />
  );
}
