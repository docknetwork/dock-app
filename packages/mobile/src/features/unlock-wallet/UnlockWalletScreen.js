import React, {useEffect, useState} from 'react';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  Image,
} from '../../design-system';
import styled from 'styled-components/native';
import {BackButton} from '../../design-system/buttons';
import SplashLogo from '../../assets/splash-logo.png';
import KeyboardDeleteIcon from '../../assets/icons/keyboard-delete.svg';
import {useDispatch, useSelector} from 'react-redux';
import {appSelectors} from '../app/app-slice';
import {walletOperations, walletSelectors} from '../wallet/wallet-slice';
import {NumericKeyboard} from '../wallet/CreatePasscodeScreen';
import {translate} from '../../locales';
import {showToast} from 'src/core/toast';

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

export function UnlockWalletScreen({
  onNumber,
  onDelete,
  onLoginWithBiometric,
  text = translate('unlock_wallet.enter_passcode'),
  digits = DIGITS,
  filled = 0,
  biometry = false,
}) {
  return (
    <ScreenContainer testID="unlockWalletScreen">
      <Box justifyContent="center" row>
        <Image
          source={SplashLogo}
          style={{
            width: '57%',
          }}
          resizeMode="contain"
        />
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
          onDelete={onDelete}
          onNumber={onNumber}
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
      </Content>
    </ScreenContainer>
  );
}

export function UnlockWalletContainer({route}) {
  const {callback} = route.params || {};
  const [passcode, setPasscode] = useState('');
  const supportBiometry = useSelector(appSelectors.getSupportedBiometryType);
  const walletInfo = useSelector(walletSelectors.getWalletInfo);
  const dispatch = useDispatch();

  const handleNumber = async num => {
    const value = `${passcode}${num}`;

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
      }

      setTimeout(() => {
        setPasscode('');
      }, 100);
    }
  };

  const handleDelete = () => {
    setPasscode(passcode.substring(0, passcode.length - 1));
  };

  const handleBiometricUnlock = async () => {
    try {
      await dispatch(walletOperations.unlockWallet({biometry: true, callback}));
    } catch (err) {
      setPasscode('');
    }
  };

  useEffect(() => {
    if (supportBiometry && walletInfo.biometry) {
      handleBiometricUnlock();
    } else {
      setPasscode('');
    }
  }, []);

  return (
    <UnlockWalletScreen
      digits={DIGITS}
      filled={passcode.length}
      onNumber={handleNumber}
      onDelete={handleDelete}
      onLoginWithBiometric={handleBiometricUnlock}
      biometry={supportBiometry}
    />
  );
}
