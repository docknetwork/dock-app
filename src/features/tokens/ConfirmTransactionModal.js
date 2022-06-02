import {Box, Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {withErrorBoundary} from 'src/core/error-handler';
import {formatCurrency, formatDockAmount} from 'src/core/format-utils';
import {Button, Theme} from 'src/design-system';
import {translate} from 'src/locales';
import {Modal} from '../../components/Modal';
import {Typography} from '../../design-system';
import {getDockTokenPrice} from './price-service';
import BigNumber from 'bignumber.js';

export const TokenAmount = withErrorBoundary(
  ({amount, symbol = 'DOCK', children}) => {
    const [fiatAmount, setFiatAmount] = useState(0);
    const fiatSymbol = 'USD';

    useEffect(() => {
      getDockTokenPrice().then(price =>
        setFiatAmount(BigNumber(amount).toNumber() * price),
      );
    }, [amount]);

    return children({
      fiatAmount,
      fiatSymbol,
      tokenAmount: formatDockAmount(amount),
      tokenSymbol: symbol,
    });
  },
);

export const AmountDetails = withErrorBoundary(props => {
  return (
    <TokenAmount {...props}>
      {({fiatAmount, fiatSymbol, tokenAmount, tokenSymbol}) => (
        <Stack direction="row">
          <Typography mr={2}>
            {tokenAmount} {tokenSymbol}
          </Typography>
          <Typography>
            {formatCurrency(fiatAmount)} {fiatSymbol}
          </Typography>
        </Stack>
      )}
    </TokenAmount>
  );
});

export const ConfirmTransactionModal = withErrorBoundary(
  ({
    onClose,
    onConfirm,
    visible,
    accountIcon,
    tokenSymbol,
    sentAmount,
    fee,
    recipientAddress,
    amountMessage,
  }) => {
    return (
      <Modal visible={visible} onClose={onClose} modalSize={0.8}>
        <Stack p={8}>
          <Typography variant="h1" mb={4}>
            {translate('confirm_transaction.title')}
          </Typography>
          <Stack mb={2}>
            <Typography mb={1}>
              {translate('confirm_transaction.send')}
            </Typography>
            <AmountDetails amount={sentAmount} symbol={tokenSymbol} />
            {amountMessage ? (
              <Stack
                bg={Theme.colors.warningBackground}
                mt={2}
                px={2}
                py={1}
                borderRadius={Theme.borderRadius}>
                <Typography variant="warning">{amountMessage}</Typography>
              </Stack>
            ) : null}
          </Stack>
          <Stack mb={8}>
            <Box>
              <Typography mb={1}>
                {translate('confirm_transaction.to')}
              </Typography>
            </Box>
            <Stack direction="row">
              <Box w={12} h={12}>
                {accountIcon}
              </Box>
              <Box pr={10}>
                <Typography ml={2}>{recipientAddress}</Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack mb={2}>
            <Typography mb={1}>
              {translate('confirm_transaction.fee')}
            </Typography>
            <AmountDetails amount={fee} symbol={tokenSymbol} />
          </Stack>
          <Stack>
            <Typography mb={1}>
              {translate('confirm_transaction.total')}
            </Typography>
            <AmountDetails
              amount={parseFloat(sentAmount) + parseFloat(fee)}
              symbol={tokenSymbol}
            />
          </Stack>
        </Stack>
        <Stack px={8}>
          <Button.Group
            mx={{
              base: 'auto',
              md: 0,
            }}
            size="md">
            <Button colorScheme="dark" onPress={onClose} width="50%">
              {translate('navigation.cancel')}
            </Button>
            <Button onPress={onConfirm} width="50%">
              {translate('navigation.ok')}
            </Button>
          </Button.Group>
        </Stack>
      </Modal>
    );
  },
);
