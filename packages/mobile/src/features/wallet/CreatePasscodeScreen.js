import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletActions} from './wallet-slice';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  runAfterInteractions,
  Theme,
} from '../../design-system';
import styled from 'styled-components/native';
import {BackButton} from '../../design-system/buttons';
import KeyboardDeleteIcon from '../../assets/icons/keyboard-delete.svg';
import {translate} from '../../locales';

const Circle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid white;
  margin: 0 7px;
  background-color: ${props => (props.filled ? Theme.colors.textHighlighted : Theme.colors.transparent)};
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

function KeyboardButton({onPress, value, testID}) {
  return (
    <Box
      testID={testID}
      flex
      alignItems="center"
      onPress={() => value !== null && onPress(value)}>
      <Typography
        variant="h1"
        fontSize={30}
        lineHeight={37}>
        {value}
      </Typography>
    </Box>
  );
}

export function NumericKeyboard({onNumber, onDelete, ...props}) {
  return (
    <Box {...props} flex>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[1, 2, 3].map(value => (
          <KeyboardButton
            key={value}
            onPress={onNumber}
            value={value}
            testID={`keyboardNumber${value}`}
          />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[4, 5, 6].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[7, 8, 9].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[null, 0].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
        <Box flex alignItems="center" paddingTop={5} onPress={onDelete}>
          <KeyboardDeleteIcon />
        </Box>
      </Box>
    </Box>
  );
}

export function CreatePasscodeScreen({
  digits = 6,
  filled = 2,
  confirmation,
  onNumber,
  onDelete,
}) {
  return (
    <ScreenContainer testID="createPasscodeScreen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <PasscodeMask marginTop={59} digits={digits} filled={filled} />
        <Box alignItems="center">
          <Typography variant="h2" marginTop={52}>
            {confirmation
              ? translate('create_wallet.confirm_passcode')
              : translate('create_wallet.create_passcode')}
          </Typography>
        </Box>
        <NumericKeyboard
          marginTop={85}
          onDelete={onDelete}
          onNumber={onNumber}
        />
      </Content>
    </ScreenContainer>
  );
}

const DIGITS = 6;

export function CreatePasscodeContainer() {
  const [passcode, setPasscode] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const dispatch = useDispatch();

  const handleConfirmation = value => {
    setPasscode('');
    setConfirmation('');

    if (confirmation !== value) {
      alert(`Passcode doesn't match, try again`);
      return;
    }

    dispatch(walletActions.setPasscode(value));
    navigate(Routes.CREATE_WALLET_PROTECT);
  };

  const handleNumber = num => {
    const value = `${passcode}${num}`;

    if (value.length > DIGITS) {
      return;
    }

    setPasscode(value);

    runAfterInteractions(() => {
      if (value.length === DIGITS) {
        if (confirmation) {
          handleConfirmation(value);
        } else {
          setConfirmation(value);
          setPasscode('');
        }
      }
    });
  };

  const handleDelete = () => {
    setPasscode(passcode.substring(0, passcode.length - 1));
  };

  return (
    <CreatePasscodeScreen
      digits={DIGITS}
      filled={passcode.length}
      onNumber={handleNumber}
      onDelete={handleDelete}
      confirmation={confirmation}
    />
  );
}
