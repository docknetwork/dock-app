import React, {useCallback, useEffect, useMemo, useState} from 'react';
import queryString from 'query-string';
import Pusher from 'pusher-js/react-native';
import WebView from 'react-native-webview';
import {Image, NBox, Typography} from '../../../design-system';
import {translate} from '../../../locales';
import {Button} from 'native-base';
import TransakLogo from '../../../assets/transak_logo.png';
import {addTestId} from '../../../core/automation-utils';
import {StyleSheet} from 'react-native';
import {
  TRANSAK_PUSHER_API_KEY,
  STAGING_TRANSAK_ENVIRONMENT,
  PROD_TRANSAK_ENVIRONMENT,
  STAGING_TRANSAK_API_KEY,
  PROD_TRANSAK_API_KEY,
  PROD_TRANSAK_BASE_URL,
  STAGING_TRANSAK_BASE_URL,
} from '@env';
import {useNavigation} from '@react-navigation/native';
import {
  ANALYTICS_EVENT,
  logAnalyticsEvent,
} from '../../analytics/analytics-slice';
import {useSelector} from 'react-redux';
import {appSelectors} from '../../app/app-slice';

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

const TRANSAK_ENVIRONMENT_CONFIG = {
  mainnet: PROD_TRANSAK_ENVIRONMENT,
  local: STAGING_TRANSAK_ENVIRONMENT,
  testnet: STAGING_TRANSAK_ENVIRONMENT,
};

const TRANSAK_API_KEY_CONFIG = {
  mainnet: PROD_TRANSAK_API_KEY,
  local: STAGING_TRANSAK_API_KEY,
  testnet: STAGING_TRANSAK_API_KEY,
};
const TRANSAK_BASE_URL_CONFIG = {
  mainnet: PROD_TRANSAK_BASE_URL,
  local: STAGING_TRANSAK_BASE_URL,
  testnet: STAGING_TRANSAK_BASE_URL,
};

export const parseTransakConfig = (transakConfig, network) => {
  return transakConfig[network];
};

export default function TransakPaymentProvider({
  walletAddress,
  partnerOrderId,
}) {
  const [buyState, setBuyState] = useState(BUY_STATES.INTRO);
  const {goBack} = useNavigation();

  const currentNetworkId = useSelector(appSelectors.getNetworkId);

  const queryUrl = useMemo(() => {
    return queryString.stringify({
      partnerOrderId,
      apiKey: parseTransakConfig(TRANSAK_API_KEY_CONFIG, currentNetworkId),
      environment: parseTransakConfig(
        TRANSAK_ENVIRONMENT_CONFIG,
        currentNetworkId,
      ),
      cryptoCurrencyCode: 'DOCK',
      walletAddress,
    });
  }, [currentNetworkId, partnerOrderId, walletAddress]);

  useEffect(() => {
    const pusher = new Pusher(TRANSAK_PUSHER_API_KEY, {cluster: 'ap2'});

    pusher.connection.bind('error', function (err) {
      console.log(err);
    });

    pusher.subscribe(
      `${parseTransakConfig(
        TRANSAK_API_KEY_CONFIG,
        currentNetworkId,
      )}_${partnerOrderId}`,
    );

    pusher.bind_global((eventId, orderData) => {
      if (
        eventId === BUY_STATES.ORDER_COMPLETED ||
        eventId === BUY_STATES.ORDER_FAILED
      ) {
        if (eventId === BUY_STATES.ORDER_COMPLETED) {
          logAnalyticsEvent(ANALYTICS_EVENT.TOKENS.BUY_TOKEN, {
            id: partnerOrderId,
            walletAddress,
            ...orderData,
          });
        }
        if (eventId === BUY_STATES.ORDER_FAILED) {
          logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
            name: ANALYTICS_EVENT.TOKENS.BUY_TOKEN,
            id: partnerOrderId,
            walletAddress,
            ...orderData,
          });
        }

        setTimeout(goBack, 3000);
      }
    });

    return () => {
      pusher.unsubscribe(
        `${parseTransakConfig(
          TRANSAK_API_KEY_CONFIG,
          currentNetworkId,
        )}_${partnerOrderId}`,
      );
    };
  }, [currentNetworkId, goBack, partnerOrderId, walletAddress]);

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
      return (
        <TransakWebView
          url={`${parseTransakConfig(
            TRANSAK_BASE_URL_CONFIG,
            currentNetworkId,
          )}?${queryUrl}`}
        />
      );
    }
    return (
      <NBox mx={7} mt={12}>
        <Typography variant="description" marginTop={30}>
          {translate('intro_transak.processing_transaction')}
        </Typography>
      </NBox>
    );
  }, [buyState, currentNetworkId, queryUrl]);
  return <NBox flex={1}>{getScreenContent()}</NBox>;
}
