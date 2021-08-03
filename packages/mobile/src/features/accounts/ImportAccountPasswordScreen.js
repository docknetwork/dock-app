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
  SelectToggler,
  NBox as Box,
  Select,
  Input,
  InputPopover,
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {
  createAccountOperations, createAccountSelectors,
} from '../account-creation/create-account-slice';
import {PasswordInputContainer} from '../../components/PasswordInputScreen';

export function ImportAccountPasswordContainer({ route }) {
  const dispatch = useDispatch();

  const handleSubmit = ({ password }) => {
    return dispatch(createAccountOperations.unlockJson(password))
  };

  return (
    <PasswordInputContainer onSubmit={handleSubmit} />
  );
}
