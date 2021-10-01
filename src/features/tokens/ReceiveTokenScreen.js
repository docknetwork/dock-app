import Clipboard from '@react-native-community/clipboard';
import {Box, Stack} from 'native-base';
import React from 'react';
import {Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
import {PolkadotIcon} from 'src/components/PolkadotIcon';
import {formatAddress} from 'src/core/format-utils';
import {showToast} from 'src/core/toast';
import {
  BackButton,
  Button,
  Content,
  Header,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {accountSelectors} from '../accounts/account-slice';

export function ReceiveTokenScreen({
  address,
  accountName,
  accountIcon,
  onCopyAddress,
  onShareAddress,
}) {
  const qrSize = Dimensions.get('window').width * 0.7;

  return (
    <ScreenContainer testID="unlockWalletScreen">
      <Header>
        <BackButton />
      </Header>
      <Stack alignItems="center">
        <Typography variant="h1" mb={2}>
          {translate('receive_token.title')}
        </Typography>
        <Typography variant="screen-description">
          {translate('receive_token.description')}
        </Typography>
      </Stack>
      <Content marginLeft={26} marginRight={26}>
        <Stack
          bg={Theme.colors.secondaryBackground}
          p={5}
          alignItems="center"
          borderRadius={12}
          my={7}>
          <Stack p={2} bg={Theme.colors.qrCodeBackground}>
            <QRCode value={address} size={qrSize} />
          </Stack>
          <Stack direction="row" alignItems="center" flex={1} pt={5}>
            <Box pr={2}>{accountIcon}</Box>
            <Stack direction="column" alignItems="flex-start" flex={1}>
              <Typography variant="h3">{accountName}</Typography>
              <Typography>{formatAddress(address)}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <Button onPress={onCopyAddress} colorScheme="tertiary" mb={4}>
            {translate('receive_token.copy_address')}
          </Button>
          <Button onPress={onShareAddress} colorScheme="tertiary">
            {translate('receive_token.share_address')}
          </Button>
        </Stack>
      </Content>
    </ScreenContainer>
  );
}

export function ReceiveTokenContainer({route}) {
  const {address} = route.params || {};
  const accountDetails = useSelector(accountSelectors.getAccountById(address));

  const handleCopyAddress = () => {
    Clipboard.setString(address);
    showToast({
      message: translate('receive_token.address_copied'),
    });
  };

  const handleShareAddress = () =>
    Share.open({
      message: address,
    });

  return (
    <ReceiveTokenScreen
      onCopyAddress={handleCopyAddress}
      onShareAddress={handleShareAddress}
      address={address}
      accountName={accountDetails.name}
      accountIcon={<PolkadotIcon address={address} size={32} />}
    />
  );
}
