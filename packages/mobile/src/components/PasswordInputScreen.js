import {
  Button,
  FormControl,
  Stack,
  Tooltip,
  Pressable,
  Popover,
  TextArea,
  Text,
} from 'native-base';
import React, {useState} from 'react';
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
  Theme,
  ErrorAlert,
  InputError,
} from '../design-system';
import {BackButton} from '../design-system/buttons';
import {translate} from '../locales';

export function PasswordInputScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
}) {
  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('password_input.title')}
        </Typography>
        <Box mt={7}>
          <Input
            placeholder="Password"
            value={form.password}
            onChangeText={onChange('password')}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </Box>
        <InputError form={form} id="password" />
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="next-btn"
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          {translate('password_input.submit')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function PasswordInputContainer({onSubmit}) {
  const [form, setForm] = useState({
    password: '',
    _errors: {},
    _hasError: false,
  });

  const handleChange = key => evt => {
    setForm(v => ({
      ...v,
      [key]: evt,
    }));
  };

  const clearErrors = () =>
    setForm(f => ({
      _errors: {},
    }));

  const handleSubmit = async () => {
    try {
      clearErrors();
      await onSubmit(form);
    } catch (err) {
      console.error(err);
      setForm(f => ({
        ...f,
        _errors: {
          password: 'The password you entered is incorrect',
        },
      }));
    }
  };

  const submitDisabled = !form.password;

  return (
    <PasswordInputScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
