import {Checkbox} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {translate} from 'src/locales';
import {Routes} from '../../core/routes';
import {
  Content,
  Footer,
  Header,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {GlobalConstants} from '../constants';
import {CreateAccountConstants} from './constants';
import {createAccountOperations} from './create-account-slice';
import {useNavigation} from '@react-navigation/native';

export function CreateAccountBackupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  onSkip,
}) {
  return (
    <ScreenContainer
      testID={CreateAccountConstants.testID.createAccountScreen.container}>
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('create_account_backup.title')}
        </Typography>
        <Typography marginTop={12}>
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
  const {navigate} = useNavigation();
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
