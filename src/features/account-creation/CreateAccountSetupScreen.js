import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AccountAdvancedOptions} from '../../components/AccountAdvancedOptions';
import {
  Content,
  Footer,
  Header,
  Input,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {translate} from '../../locales';
import {createAccountOperations} from './create-account-slice';
import {CreateAccountSetupTestIDs} from './test-ids';

export function CreateAccountSetupScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
}) {
  return (
    <ScreenContainer testID="createAccount">
      <Header>
        <BackButton testID="createAccount.backBtn" />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('account_setup.title')}
        </Typography>
        <Typography f marginTop={12}>
          {translate('account_setup.description')}
        </Typography>
        <Box mt={7}>
          <Input
            placeholder={translate('account_setup.account_name_input')}
            value={form.accountName}
            onChangeText={onChange('accountName')}
            testID={CreateAccountSetupTestIDs.acountNameInput}
          />
        </Box>

        <AccountAdvancedOptions onChange={onChange} form={form} />
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID={CreateAccountSetupTestIDs.nextBtn}
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function CreateAccountSetupContainer() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    accountName: '',
    keypairType: 'sr25519',
    derivationPath: '',
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
    return dispatch(createAccountOperations.submitAccountForm(form));
  };

  const submitDisabled = !form.accountName;

  return (
    <CreateAccountSetupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
