import React, {useCallback, useEffect, useMemo, useState} from 'react';
import queryString from 'query-string';
import Pusher from 'pusher-js/react-native';
import {navigateBack} from '../../../core/navigation';
import WebView from 'react-native-webview';
import {Image, NBox, Typography} from '../../../design-system';
import {translate} from '../../../locales';
import {Button} from 'native-base';
import TransakLogo from '../../../assets/transak_logo.png';
import {addTestId} from '../../../core/automation-utils';
import {StyleSheet} from 'react-native';
import {
  TRANSAK_PUSHER_API_KEY,
  TRANSAK_ENVIRONMENT,
  TRANSAK_API_KEY,
  TRANSAK_BASE_URL,
} from '@env';

const BUY_STATES = {
  INTRO: 'INTRO',
  INITIATED: 'INITIATED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  ORDER_FAILED: 'ORDER_FAILED',
  ORDER_PROCESSING: 'ORDER_PROCESSING',
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_PAYMENT_VERIFYING: 'ORDER_PAYMENT_VERIFYING',
};
const styles = StyleSheet.create({
  logo: {
    width: '57%',
  },
});

export function TransakIntroView({onPress}) {
  return (
    <NBox mx={7} mt={20} mb={12} flex={1}>
      <Image source={TransakLogo} style={styles.logo} resizeMode="contain" />
      <Typography variant="description" marginTop={52}>
        {translate('intro_transak.buy_dock_via_debit_card')}
      </Typography>
      <Typography variant="description" marginTop={30}>
        {translate('intro_transak.countries_available')}
        {'\n'}
        {TRANSAK_PUSHER_API_KEY}
        {'\n'}
        {TRANSAK_ENVIRONMENT}
        {'\n'}
        {TRANSAK_API_KEY}
        {'\n'}
        {TRANSAK_BASE_URL}
      </Typography>
      <NBox flex={1} />
      <Button
        ml={2}
        size="sm"
        {...addTestId('ContinueToTransak')}
        onPress={onPress}>
        {translate('intro_transak.continue_to_transak')}
      </Button>
    </NBox>
  );
}

export function TransakWebView({url}) {
  return (
    <WebView
      source={{
        uri: url,
      }}
    />
  );
}

export default function TransakPaymentProvider({
  walletAddress,
  partnerOrderId,
}) {
  const [buyState, setBuyState] = useState(BUY_STATES.INTRO);

  const queryUrl = useMemo(() => {
    return queryString.stringify({
      partnerOrderId,
      apiKey: TRANSAK_API_KEY,
      environment: TRANSAK_ENVIRONMENT,
      cryptoCurrencyCode: 'DOCK',
      walletAddress,
    });
  }, [walletAddress, partnerOrderId]);

  useEffect(() => {
    const pusher = new Pusher(TRANSAK_PUSHER_API_KEY, {cluster: 'ap2'});

    pusher.connection.bind('error', function (err) {
      console.log(err);
    });

    pusher.subscribe(`${TRANSAK_API_KEY}_${partnerOrderId}`);

    pusher.bind_global((eventId, orderData) => {
      if (
        eventId === BUY_STATES.ORDER_COMPLETED ||
        eventId === BUY_STATES.ORDER_FAILED
      ) {
        setTimeout(() => {
          navigateBack();
        }, 3000);
      }
    });

    return () => {
      pusher.unsubscribe(`${TRANSAK_API_KEY}_${partnerOrderId}`);
    };
  }, [partnerOrderId]);

  const getScreenContent = useCallback(() => {
    if (buyState === BUY_STATES.INTRO) {
      return (
        <TransakIntroView
          onPress={() => {
            setBuyState(BUY_STATES.INITIATED);
          }}
        />
      );
    }
    if (buyState === BUY_STATES.INITIATED) {
      return <TransakWebView queryUrl={`${TRANSAK_BASE_URL}?${queryUrl}`} />;
    }
    return (
      <NBox mx={7} mt={12}>
        <Typography variant="description" marginTop={30}>
          {translate('intro_transak.processing_transaction')}
        </Typography>
      </NBox>
    );
  }, [buyState, queryUrl]);
  return <NBox flex={1}>{getScreenContent()}</NBox>;
}
