import Clipboard from '@react-native-community/clipboard';
import {Button} from 'native-base';
import React from 'react';
import {useSelector} from 'react-redux';
import {Routes} from '../../core/routes';
import {showToast} from '../../core/toast';
import {
  Content,
  Footer,
  Header,
  LoadingButton,
  NBox as Box,
  ScreenContainer,
  Text,
  Theme,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import {translate} from '../../locales';
import {createAccountSelectors} from './create-account-slice';
import {withErrorBoundary} from '../../core/error-handler';
import {useNavigation} from '@react-navigation/native';

export function CreateAccountMnemonicScreen({phrase, onCopy, onSubmit}) {
  return (
    <ScreenContainer testID="create-wallet-screen" hideGlobalHeader>
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('account_recovery_phrase.title')}
        </Typography>
        <Typography marginTop={12}>
          {translate('account_recovery_phrase.description')}
        </Typography>
        <Box
          flexDirection="row"
          flexWrap="wrap"
          backgroundColor={Theme.colors.secondaryBackground}
          borderRadius={12}
          p={5}
          mt={8}>
          {phrase.split(' ').map((word, idx) => (
            <Box flexDirection="row" width="33%" p={3} key={word}>
              <Text fontSize={14} mr={2} color={Theme.colors.description}>{`${
                idx + 1
              }`}</Text>
              <Text fontSize={14}>{word}</Text>
            </Box>
          ))}
        </Box>
        <Button
          full
          testID="next-btn"
          variant="unstyled"
          backgroundColor={Theme.colors.secondaryBackground}
          mt={5}
          onPress={onCopy}>
          {translate('account_recovery_phrase.copy_phrase')}
        </Button>
      </Content>
      <Footer marginBottom={0} marginLeft={26} marginRight={26}>
        <LoadingButton full testID="next-btn" mb={5} onPress={onSubmit}>
          {translate('navigation.next')}
        </LoadingButton>
      </Footer>
    </ScreenContainer>
  );
}

export const CreateAccountMnemonicContainer = withErrorBoundary(
  () => {
    const phrase = useSelector(createAccountSelectors.getMnemonicPhrase);
    const {navigate} = useNavigation();

    const handleCopy = () => {
      Clipboard.setString(phrase);

      showToast({
        message: translate('account_recovery_phrase.phrase_copied'),
      });
    };

    const handleSubmit = () => navigate(Routes.CREATE_ACCOUNT_VERIFY_PHRASE);

    return (
      <CreateAccountMnemonicScreen
        phrase={phrase}
        onSubmit={handleSubmit}
        onCopy={handleCopy}
      />
    );
  },
  {disableLogs: true},
);
