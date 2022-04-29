import {captureException} from '@sentry/react-native';
import {Stack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import {useDispatch, useSelector} from 'react-redux';
import {Modal} from 'src/components/Modal';
import {NumericKeyboard} from 'src/components/NumericKeyboard';
import {addTestId} from 'src/core/automation-utils';
import {Logger} from 'src/core/logger';
import {showToast} from 'src/core/toast';
import styled from 'styled-components/native';
import SplashLogo from '../../assets/splash-logo.png';
import {useIsFocused} from '@react-navigation/native';
import {
  Box,
  Button,
  Content,
  Image,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {appActions, appSelectors} from '../app/app-slice';
import {BuildIdentifier} from '../app/BuildIdentifier';
import {walletOperations, walletSelectors} from '../wallet/wallet-slice';

const Circle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid white;
  margin: 0 7px;
  background-color: ${props => (props.filled ? '#fff' : 'transparent')};
`;

function PasscodeMask({digits = 6, filled = 0, ...props}) {
  const digitsArray = new Array(digits).fill(0);

  return (
    <Box {...props}>
      <Box justifyContent="center" row>
        {digitsArray.map((_, idx) => (
          <Circle filled={idx < filled} key={idx} />
        ))}
      </Box>
    </Box>
  );
}

const DIGITS = 6;

const styles = StyleSheet.create({
  logo: {
    width: '57%',
  },
});

export function UnlockWalletScreen({
  onPasscodeChange,
  passcode,
  onLoginWithBiometric,
  text = translate('unlock_wallet.enter_passcode'),
  digits = DIGITS,
  filled = 0,
  biometry = false,
  onLogoPress,
  locked,
  onCloseApp,
}) {
  return (
    <ScreenContainer
      {...addTestId('unlockWalletScreen')}
      hideGlobalHeader={true}>
      <Box justifyContent="center" row onPress={onLogoPress}>
        <Image source={SplashLogo} style={styles.logo} resizeMode="contain" />
      </Box>
      <Content marginLeft={26} marginRight={26}>
        <PasscodeMask marginTop={20} digits={digits} filled={filled} />
        <Box alignItems="center">
          <Typography variant="h2" marginTop={52}>
            {text}
          </Typography>
        </Box>
        <NumericKeyboard
          marginTop={50}
          onChange={onPasscodeChange}
          value={passcode}
        />
        {biometry ? (
          <Box
            alignItems="center"
            marginBottom={20}
            onPress={onLoginWithBiometric}>
            <Typography variant="description">
              {translate('unlock_wallet.biometrics_login')}
            </Typography>
          </Box>
        ) : null}
        <BuildIdentifier />
        <Modal visible={locked}>
          <Stack m={5} p={5} alignItems="center">
            <Typography variant="h2">
              {translate('unlock_wallet.app_locked_title')}
            </Typography>
            <Typography variant="h4">
              {translate('unlock_wallet.app_locked_description')}
            </Typography>
            <Stack mt={4}>
              <Button onPress={onCloseApp}>
                {translate('unlock_wallet.close_app')}
              </Button>
            </Stack>
          </Stack>
        </Modal>
      </Content>
    </ScreenContainer>
  );
}

export function UnlockWalletContainer({route}) {
  const {callback} = route.params || {};
  const [passcode, setPasscode] = useState('');
  const supportBiometry = useSelector(appSelectors.getSupportedBiometryType);
  const walletInfo = useSelector(walletSelectors.getWalletInfo);
  const biometryEnabled = walletInfo && walletInfo.biometry;
  const [logoPressCount, setLogoPressCount] = useState(1);
  const isAppLocked = useSelector(appSelectors.getAppLocked);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const isScreenFocus = useIsFocused();

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      setPasscode('');
    };
  }, []);

  const handlePasscodeChange = async value => {
    if (value.length > DIGITS) {
      return;
    }

    setPasscode(value);

    if (value.length === DIGITS) {
      try {
        await dispatch(
          walletOperations.unlockWallet({passcode: value, callback}),
        );
      } catch (err) {
        showToast({
          message: translate('unlock_wallet.invalid_passcode'),
          type: 'error',
        });

        if (failedAttempts >= 4) {
          setFailedAttempts(0);
          dispatch(appActions.setLockedTime(Date.now() + 1000 * 60));
        } else {
          setFailedAttempts(v => v + 1);
        }
      }
    }
  };

  const handleBiometricUnlock = useCallback(async () => {
    try {
      await dispatch(walletOperations.unlockWallet({biometry: true, callback}));
    } catch (err) {
      setPasscode('');
    }
  }, [dispatch, callback]);

  const handleLogoPress = () => {
    Logger.debug(logoPressCount);

    if (logoPressCount === 5) {
      captureException(new Error('Testing sentry'));
      return;
    }

    setLogoPressCount(v => v + 1);
  };

  useEffect(() => {
    if (supportBiometry && biometryEnabled && isScreenFocus) {
      handleBiometricUnlock();
    } else {
      setPasscode('');
    }
  }, [supportBiometry, biometryEnabled, handleBiometricUnlock, isScreenFocus]);

  return (
    <UnlockWalletScreen
      locked={isAppLocked}
      digits={DIGITS}
      filled={passcode.length}
      onPasscodeChange={handlePasscodeChange}
      onLoginWithBiometric={handleBiometricUnlock}
      biometry={supportBiometry}
      passcode={passcode}
      onLogoPress={handleLogoPress}
      onCloseApp={() => {
        RNExitApp.exitApp();
      }}
    />
  );
}
