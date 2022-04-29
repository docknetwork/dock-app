import {CheckCircleIcon, Stack} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addTestId} from 'src/core/automation-utils';
import {translate} from 'src/locales';
import {showToast} from '../../core/toast';
import {useNavigation} from '@react-navigation/native';
import {
  Content,
  Footer,
  Header,
  Input,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {accountOperations} from './account-slice';
import {AccountsConstants} from './constants';

const CheckCircle = ({checked}) => (
  <CheckCircleIcon
    color={checked ? Theme.colors.circleChecked : Theme.colors.circleUnckecked}
    width={16}
    height={16}
    marginRight={2}
  />
);

export function GenericPasswordScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  title,
  description,
}) {
  return (
    <ScreenContainer {...addTestId('CreateWalletScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {title}
        </Typography>
        <Typography marginTop={12}>{description}</Typography>

        <Box mt={7}>
          <Input
            placeholder="Password"
            {...addTestId('Password')}
            value={form.password}
            onChangeText={onChange('password')}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </Box>

        <Box mt={7}>
          <Input
            placeholder="Confirm password"
            {...addTestId('ConfirmPassword')}
            value={form.passwordConfirmation}
            onChangeText={onChange('passwordConfirmation')}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </Box>
        <Stack marginTop={4}>
          <Stack direction="row">
            <CheckCircle checked={form.lengthValidation} />
            <Typography>
              {translate('create_password.include_char_length')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.digitsValidation} />
            <Typography>
              {translate('create_password.include_digits')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.caseValidation} />
            <Typography>
              {translate('create_password.include_proper_case')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.specialCharactersValidation} />
            <Typography>
              {translate('create_password.include_special_characters')}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={3}>
            <CheckCircle checked={form.passwordMatchValidation} />
            <Typography>
              {translate('create_password.passwords_match')}
            </Typography>
          </Stack>
        </Stack>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          {...addTestId('NextBtn')}
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function GenericPasswordContainer({onSubmit, title, description}) {
  const [form, setForm] = useState({
    password: '',
    passwordConfirmation: '',
    _errors: {},
    _hasError: false,
  });

  const handleChange = key => value => {
    const updatedForm = {
      ...form,
      [key]: value,
    };

    if (key === 'password') {
      updatedForm.lengthValidation = value.length >= 8;
      updatedForm.digitsValidation = /\d/.test(value);
      updatedForm.caseValidation = /[A-Z]/.test(value) && /[a-z]/.test(value);
      updatedForm.specialCharactersValidation = /\W/.test(value);
    }

    updatedForm.passwordMatchValidation =
      updatedForm.password === updatedForm.passwordConfirmation;

    setForm(v => ({
      ...v,
      ...updatedForm,
    }));
  };

  const handleSubmit = () => {
    if (form.password !== form.passwordConfirmation) {
      showToast({
        message: "Password confirmation doesn't match",
        type: 'error',
      });
      return;
    }

    return onSubmit(form);
  };

  const formValid =
    form.password &&
    form.passwordConfirmation &&
    form.caseValidation &&
    form.specialCharactersValidation &&
    form.digitsValidation &&
    form.passwordMatchValidation &&
    form.lengthValidation;

  return (
    <GenericPasswordScreen
      form={form}
      submitDisabled={!formValid}
      onChange={handleChange}
      onSubmit={handleSubmit}
      description={description}
      title={title}
    />
  );
}

export function ExportAccountPasswordContainer({route}) {
  const dispatch = useDispatch();
  const {method, accountId} = route.params;

  return (
    <GenericPasswordContainer
      description={AccountsConstants.exportAccount.locales.description}
      title={AccountsConstants.exportAccount.locales.title}
      onSubmit={form => {
        return dispatch(
          accountOperations.exportAccountAs({
            accountId,
            method,
            password: form.password,
          }),
        );
      }}
    />
  );
}
