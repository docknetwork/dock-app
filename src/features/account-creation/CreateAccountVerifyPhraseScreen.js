import {FormControl, Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../../core/toast';
import {
  Content,
  Footer,
  Header,
  Input,
  LoadingButton,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {translate} from '../../locales';
import {accountOperations, accountSelectors} from '../accounts/account-slice';
import {
  createAccountOperations,
  createAccountSelectors,
} from './create-account-slice';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {KeyboardAvoidingView, Platform} from 'react-native';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
export function CreateAccountVerifyPhraseScreen({
  form,
  onChange,
  submitDisabled,
  onSubmit,
  confirmationIndexes,
}) {
  return (
    <ScreenContainer testID="createAccountVerifyPhraseScreen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('verify_recovery_phrase.title')}
        </Typography>
        <Typography fontWeight="400" marginTop={12}>
          {translate('verify_recovery_phrase.description')}
        </Typography>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('verify_recovery_phrase.verify_word')}
              {`${confirmationIndexes[0] + 1}`}
            </FormControl.Label>
            <Input
              value={form.word1}
              onChangeText={onChange('word1')}
              autoCapitalize="none"
            />
          </Stack>
        </FormControl>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('verify_recovery_phrase.verify_word')}
              {`${confirmationIndexes[1] + 1}`}
            </FormControl.Label>
            <Input
              value={form.word2}
              onChangeText={onChange('word2')}
              autoCapitalize="none"
            />
          </Stack>
        </FormControl>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <LoadingButton
          full
          testID="next-btn"
          mb={5}
          onPress={onSubmit}
          isDisabled={submitDisabled}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

// UI only, do NOT use for data encryption
function getRandomNumbersUnsafe(maxNum = 1, resultSize = 0) {
  let result = [];

  for (let i = 0; i < resultSize; i++) {
    let value;

    do {
      value = Math.floor(Math.random() * maxNum);
    } while (result.find(v => v === value));

    result.push(value);
  }

  return result;
}

export function CreateAccountVerifyPhraseContainer() {
  const dispatch = useDispatch();
  const phrase = useSelector(createAccountSelectors.getMnemonicPhrase);
  const existingAccountBackup = useSelector(
    accountSelectors.getAccountToBackup,
  );

  const [confirmationIndexes, setConfirmationIndexes] = useState([]);
  const [form, setForm] = useState({
    word1: '',
    word2: '',
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
    logAnalyticsEvent(ANALYTICS_EVENT.ACCOUNT.BACKUP);
    const words = phrase.split(' ');
    const word1 = form.word1.toLowerCase();
    const word2 = form.word2.toLowerCase();

    if (
      word1 === words[confirmationIndexes[0]] &&
      word2 === words[confirmationIndexes[1]]
    ) {
      if (existingAccountBackup) {
        return dispatch(accountOperations.confirmAccountBackup());
      }

      return dispatch(
        createAccountOperations.createAccount({
          hasBackup: true,
        }),
      );
    }

    showToast({
      message: translate('verify_recovery_phrase.invalid_confirmation'),
      type: 'error',
    });
  };

  useEffect(() => {
    setConfirmationIndexes(getRandomNumbersUnsafe(12, 2));
  }, []);

  const submitDisabled = !(form.word1 && form.word2);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior="padding"
      style={{flex: 1}}>
      <CreateAccountVerifyPhraseScreen
        form={form}
        confirmationIndexes={confirmationIndexes}
        submitDisabled={submitDisabled}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </KeyboardAvoidingView>
  );
}
