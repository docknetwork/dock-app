import Clipboard from '@react-native-community/clipboard';
import {Box, Input, Stack} from 'native-base';
import React, {useState} from 'react';
import Share from 'react-native-share';
import {useDispatch, useSelector} from 'react-redux';
import {NumericKeyboard} from 'src/components/NumericKeyboard';
import {PolkadotIcon} from 'src/components/PolkadotIcon';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {showToast} from 'src/core/toast';
import {
  BackButton,
  Button,
  Content,
  Header,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {accountSelectors} from '../accounts/account-slice';
import {transactionsOperations} from '../transactions/transactions-slice';
import {ConfirmTransactionModal, TokenAmount} from './ConfirmTransactionModal';

export function SendTokenScreen({form, onChange, onScanQRCode, onNext}) {
  return (
    <ScreenContainer testID="unlockWalletScreen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Stack>
          <Typography variant="h1" mb={2}>
            {translate('send_token.title')}
          </Typography>
        </Stack>
        <Box my={7}>
          <Stack>
            <Input
              value={form.recipientAddress}
              onChangeText={onChange('address')}
              autoCapitalize="none"
              placeholder={translate('send_token.recipient_address')}
              pasteFromClipboard
            />
          </Stack>
          <Stack direction="row" alignItems="center" mt={3}>
            <Button colorScheme="secondary" size="sm" onPress={onScanQRCode}>
              {translate('send_token.scan_qr_code')}
            </Button>
          </Stack>
        </Box>
        <Stack flex={1} alignContent="flex-end">
          <Button onPress={onNext} mb={4}>
            {translate('navigation.next')}
          </Button>
        </Stack>
      </Content>
    </ScreenContainer>
  );
}

export function EnterTokenAmount({form, onMax, onChange, onBack, onNext}) {
  return (
    <ScreenContainer testID="unlockWalletScreen">
      <Header>
        <BackButton onPress={onBack} />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography
              variant="h1"
              style={{fontSize: 48, lineHeight: 60}}
              mr={2}>{`${form.amount}`}</Typography>
            <Typography variant="h1">{form.tokenSymbol}</Typography>
          </Stack>
          <TokenAmount amount={form.amount} symbol={form.tokenSymbol}>
            {({fiatSymbol, fiatAmount}) => (
              <Stack direction="row" justifyContent="center">
                <Typography>{fiatAmount}</Typography>
                <Typography>{fiatSymbol}</Typography>
              </Stack>
            )}
          </TokenAmount>
        </Stack>
        <Stack>
          <Button colorScheme="secondary" mb={2} onPress={onMax}>
            {translate('send_token.send_max')}
          </Button>
        </Stack>
        <Box my={7}>
          <NumericKeyboard
            allowDecimal
            onChange={onChange('amount')}
            value={form.amont}
          />
        </Box>
        <Stack flex={1} alignContent="flex-end">
          <Button onPress={onNext} mb={4}>
            {translate('navigation.next')}
          </Button>
        </Stack>
      </Content>
    </ScreenContainer>
  );
}

const Steps = {
  sendTo: 1,
  enterAmount: 2,
};

export function SendTokenContainer({route}) {
  const dispatch = useDispatch();
  const {address} = route.params || {};
  const accountDetails = useSelector(accountSelectors.getAccountById(address));
  const [showConfirmation, setShowConfirmation] = useState();
  const [step, setStep] = useState(Steps.sendTo);
  const [form, setForm] = useState({
    recipientAddress: '',
    amount: 0,
    tokenSymbol: 'DOCK',
    fee: 0,
    _errors: {},
    _hasError: false,
  });

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

  const handleChange = key => evt => {
    setForm(v => ({
      ...v,
      [key]: evt,
    }));
  };

  if (step === Steps.sendTo) {
    return (
      <SendTokenScreen
        form={form}
        onCopyAddress={handleCopyAddress}
        onScanQRCode={() => {
          navigate(Routes.APP_QR_SCANNER, {
            onData: data => {
              handleChange('recipientAddress')(data);
            },
          });
        }}
        onShareAddress={handleShareAddress}
        onChange={handleChange}
        onNext={() => {
          setStep(Steps.enterAmount);
        }}
      />
    );
  }

  if (step === Steps.enterAmount) {
    return (
      <>
        <ConfirmTransactionModal
          onClose={() => {
            setShowConfirmation(false);
          }}
          onConfirm={() => {
            dispatch(transactionsOperations.sendTransaction(form));
          }}
          visible={showConfirmation}
          accountIcon={<PolkadotIcon address={form.recipientAddress} />}
          tokenSymbol={form.tokenSymbol}
          sentAmount={form.amount}
          fee={form.fee}
          recipientAddress={form.recipientAddress}
        />
        <EnterTokenAmount
          form={form}
          onChange={handleChange}
          onNext={() => {
            dispatch(() => {
              transactionsOperations.getFeeAmount(form).then(fee => {
                onChange('fee')(fee);
                setShowConfirmation(true);
              });
            });
          }}
          onBack={() => {
            setStep(Steps.sendTo);
          }}
          onMax={() => {
            handleChange('amount')(accountDetails.meta.balance.value);
          }}
          tokenSymbol="DOCK"
        />
      </>
    );
  }

  return null;
}