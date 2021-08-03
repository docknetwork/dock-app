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
import {translate} from '../../locales';
import {
  createAccountOperations,
  createAccountSelectors,
} from '../account-creation/create-account-slice';

export function ImportAccountSetupScreen({
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
          {translate('import_account.title')}
        </Typography>
        <Box mt={7}>
          <Input
            placeholder={translate('import_account.account_name_input')}
            value={form.accountName}
            onChangeText={onChange('accountName')}
            autoCapitalize="none"
          />
        </Box>
      </Content>
      <Footer marginBottom={10} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="next-btn"
          isDisabled={submitDisabled}
          onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ImportAccountSetupContainer() {
  const dispatch = useDispatch();
  const currentForm = useSelector(createAccountSelectors.getForm);
  const [form, setForm] = useState({
    ...currentForm,
    accountName: currentForm.accountName || '',
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
    return dispatch(
      createAccountOperations.createAccount({
        hasBackup: true,
        successMessage: translate('import_account.import_success'),
        form,
      }),
    );
  };

  const submitDisabled = !form.accountName;

  return (
    <ImportAccountSetupScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
