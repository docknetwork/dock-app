import {
  Button,
  FormControl,
  Stack,
  Tooltip,
  Pressable,
  Popover,
  TextArea,
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  NBox as Box,
  Input,
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import { walletOperations } from './wallet-slice';
import {PasswordInputContainer} from '../../components/PasswordInputScreen';

export function ImportWalletPasswordContainer({ route }) {
  const dispatch = useDispatch();
  const { fileUri } = route.params;

  const handleSubmit = ({ password }) => {
    return dispatch(walletOperations.importWallet({
      password,
      fileUri,
    }));
  };

  return (
    <PasswordInputContainer onSubmit={handleSubmit} />
  );
}
