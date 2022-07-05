import React, {useCallback, useEffect} from 'react';
import {ScreenContainer} from '../../design-system';
import TransakPaymentProvider from './components/TransakProvider';
import {BackHandler} from 'react-native';
import {navigateBack} from '../../core/navigation';

export function BuyDockScreenScreen({walletAddress, orderId}) {
  const getPaymentProvider = useCallback(() => {
    // Default payment provider is Transak
    return (
      <TransakPaymentProvider
        partnerOrderId={orderId}
        walletAddress={walletAddress}
      />
    );
  }, [orderId, walletAddress]);

  return (
    <ScreenContainer testID="BuyDockScreenScreen">
      {getPaymentProvider()}
    </ScreenContainer>
  );
}

export function BuyDockScreenContainer({route}) {
  useEffect(() => {
    const backAction = () => {
      navigateBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const {id, orderId} = route.params;

  return <BuyDockScreenScreen walletAddress={id} orderId={orderId} />;
}
