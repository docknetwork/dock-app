import React, {useEffect, useState} from 'react';
import {
  Button,
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  Box,
  BigButton,
  runAfterInteractions,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import EmojiHappyIcon from '../../assets/icons/emoji-happy.svg';
import ArrowRight from '../../assets/icons/arrow-right.svg';
import FingerprintSimple from '../../assets/icons/fingerprint-simple.svg';
import {useDispatch, useSelector} from 'react-redux';
import {walletOperations} from './wallet-slice';
import {appSelectors, BiometryType} from '../app/app-slice';
import {ScreenSpinner} from 'src/components/ScreenSpinner';
import {showToast} from 'src/core/toast';
import {WalletConstants} from './constants';

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
      <Footer marginBottom={114} marginLeft={26} marginRight={26} flex>
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
        <BigButton onPress={onSkip} icon={<ArrowRight />}>
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

  const handleEnable = () => {
    setLoading(true);
    runAfterInteractions(() => {
      dispatch(walletOperations.createWallet({biometry: true}))
        .then(() => {
          showToast({
            message: WalletConstants.protectYourWallet.locales.biometicsEnabled,
            type: 'success',
          });
        })
        .catch(() => {
          showToast({
            message: WalletConstants.protectYourWallet.locales.biometicsFailed,
            type: 'error',
          });
        })
        .finally(() => setLoading(false));
    });
  };

  const handleSkip = () => {
    runAfterInteractions(() => dispatch(walletOperations.createWallet()));
  };

  useEffect(() => {
    if (!faceId && !fingerprint) {
      handleSkip();
    }
  }, [faceId, fingerprint]);

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
