import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from 'src/components/ScreenSpinner';
import {addTestId} from 'src/core/automation-utils';
import {showToast} from 'src/core/toast';
import ArrowRight from '../../assets/icons/arrow-right.svg';
import EmojiHappyIcon from '../../assets/icons/emoji-happy.svg';
import FingerprintSimple from '../../assets/icons/fingerprint-simple.svg';
import {
  BigButton,
  Content,
  Footer,
  Header,
  runAfterInteractions,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {appSelectors, BiometryType} from '../app/app-slice';
import {WalletConstants} from './constants';
import {walletOperations} from './wallet-slice';
import {authenticationActions} from '../unlock-wallet/unlock-wallet-slice';

export function ProtectYourWalletScreen({
  onSkip,
  onEnable,
  faceId,
  fingerprint,
}) {
  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          Protect your wallet
        </Typography>
        <Typography marginTop={12}>
          Use your biometric to add extra layer of security and easier way to
          access your wallet
        </Typography>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26} flex={1}>
        {/* <Button full icon={<LockClosedIcon />} testID="create-wallet-btn">
          Setup Passcode
        </Button> */}
        {faceId ? (
          <BigButton onPress={onEnable} icon={<EmojiHappyIcon />}>
            Use Face recognition
          </BigButton>
        ) : null}
        {fingerprint ? (
          <BigButton onPress={onEnable} icon={<FingerprintSimple />}>
            Use Fingerprint identification
          </BigButton>
        ) : null}
        <BigButton
          {...addTestId('DoThisLater')}
          onPress={onSkip}
          icon={<ArrowRight />}>
          Do this later
        </BigButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ProtectYourWalletContainer() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const supportedBiometryType = useSelector(
    appSelectors.getSupportedBiometryType,
  );
  // detect biometry
  let fingerprint = supportedBiometryType === BiometryType.Fingerprint;
  let faceId = supportedBiometryType === BiometryType.FaceId;

  const handleEnable = useCallback(() => {
    setLoading(true);
    runAfterInteractions(() => {
      dispatch(walletOperations.createWallet({biometry: true}))
        .then(() => {
          showToast({
            message: WalletConstants.protectYourWallet.locales.biometicsEnabled,
            type: 'success',
          });
        })
        .catch(err => {
          console.error(err);
          showToast({
            message: WalletConstants.protectYourWallet.locales.biometicsFailed,
            type: 'error',
          });
        })
        .finally(() => setLoading(false));
    });
  }, [dispatch]);

  const handleSkip = useCallback(() => {
    runAfterInteractions(() => {
      dispatch(walletOperations.createWallet()).then(() => {});
    });
  }, [dispatch]);

  useEffect(() => {
    if (!faceId && !fingerprint) {
      handleSkip();
    }
  }, [faceId, fingerprint, handleSkip]);

  if (loading) {
    return <ScreenSpinner />;
  }

  return (
    <ProtectYourWalletScreen
      fingerprint={fingerprint}
      faceId={faceId}
      onEnable={handleEnable}
      onSkip={handleSkip}
    />
  );
}
