import {FormControl, Stack, TextArea} from 'native-base';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AccountAdvancedOptions} from '../../components/AccountAdvancedOptions';
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
import {translate} from '../../locales';
import {createAccountOperations} from '../account-creation/create-account-slice';
import {Keyboard} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {addTestId} from 'src/core/automation-utils';

export function ImportAccountFromMnemonicScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
}) {
  return (
    <ScreenContainer {...addTestId('ImportAccountScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
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
                {...addTestId('EnterText')}
                placeholder=""
                value={form.phrase}
                onChangeText={onChange('phrase')}
                autoCapitalize="none"
              />
              <FormControl.ErrorMessage {...addTestId('ErrorMessage')}>
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
          {...addTestId('NextBtn')}
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
    if (key === 'phrase') {
      const value = evt.trim();
      if (value.split(' ').length === 12) {
        Clipboard.getString().then(cValue => {
          if (cValue === evt) {
            Keyboard.dismiss();
          }
        });
      }
    }

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
