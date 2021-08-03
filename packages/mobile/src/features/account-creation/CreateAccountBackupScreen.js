import {Button, Checkbox, FormControl, Stack} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {translate} from 'src/locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
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
  LoadingButton,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {createAccountOperations} from './create-account-slice';
import {CreateAccountConstants} from './constants';
import {GlobalConstants} from '../constants';

export function CreateAccountBackupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  onSkip,
}) {
  return (
    <ScreenContainer testID={CreateAccountConstants.testID.createAccountScreen.container}>
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography
          variant="h1"
          marginTop={52}>
          {translate('create_account_backup.title')}
        </Typography>
        <Typography
          marginTop={12}>
          {translate('create_account_backup.description')}
        </Typography>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <Box alignItems="flex-start" mb={5}>
          <Checkbox
            isChecked={form.agreement}
            onChange={onChange('agreement')}
            accessibilityLabel="Backup agreement">
            {translate('create_account_backup.agreement')}
          </Checkbox>
        </Box>
        <LoadingButton
          full
          testID={GlobalConstants.navigation.testID.next}
          mb={5}
          onPress={onSubmit}
          isDisabled={submitDisabled}>
          {translate('navigation.next')}
        </LoadingButton>
        <LoadingButton
          full
          testID={GlobalConstants.navigation.testID.skip}
          variant="unstyled"
          onPress={onSkip}>
          {translate('navigation.skip')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function CreateAccountBackupContainer() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    agreement: false,
    _errors: {},
    _hasError: false,
  });

  const handleChange = key => evt => {
    setForm(v => ({
      ...v,
      [key]: evt,
    }));
  };

  const handleSubmit = () => {
    navigate(Routes.CREATE_ACCOUNT_MNEMONIC);
  };

  const handleSkip = () => {
    return dispatch(createAccountOperations.createAccount());
  };

  const submitDisabled = !form.agreement;

  return (
    <CreateAccountBackupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
    />
  );
}
