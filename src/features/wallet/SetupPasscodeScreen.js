import React from 'react';
import {
  Button,
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import LockClosedIcon from '../../assets/icons/lock-closed.svg';
import {translate} from 'src/locales';
import {navigate} from 'src/core/navigation';
import {Routes} from 'src/core/routes';
import {addTestId} from 'src/core/automation-utils';

export function SetupPasscodeScreen() {
  return (
    <ScreenContainer {...addTestId('SetupPasscodeScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography variant="h1" marginTop={52}>
          {translate('setup_passcode.title')}
        </Typography>
        <Typography marginTop={12}>
          {translate('setup_passcode.description')}
        </Typography>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26}>
        <Button
          full
          icon={<LockClosedIcon />}
          {...addTestId('CreateWalletBtn')}
          onPress={() => {
            navigate(Routes.CREATE_WALLET_PASSCODE);
          }}>
          {translate('setup_passcode.submit')}
        </Button>
      </Footer>
    </ScreenContainer>
  );
}
