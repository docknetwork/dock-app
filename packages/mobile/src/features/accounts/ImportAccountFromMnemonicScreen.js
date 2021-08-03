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
import {useDispatch} from 'react-redux';
import {AccountAdvancedOptions} from '../../components/AccountAdvancedOptions';
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
import {createAccountOperations} from '../account-creation/create-account-slice';

export function ImportAccountFromMnemonicScreen({
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
          {translate('import_account_from_mnemonic.title')}
        </Typography>
        <Typography marginTop={12}>
          {translate('import_account_from_mnemonic.description')}
        </Typography>
        <Box>
          <FormControl isInvalid={form._errors.phrase}>
            <Stack mt={7}>
              <FormControl.Label>
                {translate('import_account_from_mnemonic.phrase_input')}
              </FormControl.Label>
              <TextArea
                placeholder=""
                value={form.phrase}
                onChangeText={onChange('phrase')}
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage>
                {translate('import_account_from_mnemonic.invalid_phrase')}
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
        </Box>
        <AccountAdvancedOptions onChange={onChange} form={form} />
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

export function ImportAccountFromMnemonicContainer() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    phrase: '',
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
    return dispatch(createAccountOperations.importFromMnemonic(form));
  };

  const submitDisabled = !form.phrase;

  return (
    <ImportAccountFromMnemonicScreen
      form={form}
      submitDisabled={submitDisabled}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
