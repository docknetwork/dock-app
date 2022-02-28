import {Input, Select, Stack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {translate} from 'src/locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {showToast} from '../../core/toast';
import {
  BackButton,
  Box,
  Button,
  ChevronRightIcon,
  Content,
  Header,
  NBox,
  OptionList,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {accountOperations} from '../accounts/account-slice';
import {
  appOperations,
  appSelectors
} from '../app/app-slice';

import {SUBSTRATE_NETWORKS} from '@docknetwork/wallet-sdk-core/lib/modules/network-manager';

export function DevSettingsScreen({onAddAccount, onNetworkChange}) {
  const [showNetworkOptions, setShowNetworkOptions] = useState();
  const [showWatchAccount, setShowWatchAccount] = useState();
  const [accountName, setAccountName] = useState();
  const [accountAddress, setAccountAddress] = useState();
  const currentNetworkId = useSelector(appSelectors.getNetworkId);
  const [networkId, setNetworkId] = useState(currentNetworkId);

  useEffect(() => {
    setNetworkId(currentNetworkId);
  }, [currentNetworkId]);

  return (
    <ScreenContainer testID="DevSettingsScreen">
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton onPress={() => navigate(Routes.APP_SETTINGS)} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">{translate('settings.title')}</Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <Content>
        <Stack flex={1}>
          <OptionList
            mx={5}
            items={[
              {
                testID: 'switch-network',
                title: translate('dev_settings.switch_network'),
                icon: <ChevronRightIcon />,
                onPress: () => {
                  setShowNetworkOptions(true);
                },
              },
              {
                testID: 'watch-account',
                title: translate('dev_settings.watch_account'),
                icon: <ChevronRightIcon />,
                onPress: () => {
                  setShowWatchAccount(true);
                },
              },
            ]}
          />
        </Stack>
        {showNetworkOptions ? (
          <Stack p={4}>
            <Typography variant="h3">
              {translate('dev_settings.switch_network')}
            </Typography>

            <Stack pb={2}>
              <Select onValueChange={setNetworkId} selectedValue={networkId}>
                {Object.keys(SUBSTRATE_NETWORKS).map(key => {
                  const networkInfo = SUBSTRATE_NETWORKS[key];

                  return <Select.Item label={networkInfo.name} value={key} />;
                })}
              </Select>
            </Stack>

            <Button
              onPress={async () =>
                onNetworkChange(networkId).then(() => {
                  setShowNetworkOptions(false);
                })
              }>
              {translate('dev_settings.update_network')}
            </Button>
            <Stack pt={3}>
              <Button
                onPress={() => setShowNetworkOptions(false)}
                colorScheme="tertiary">
                Cancel
              </Button>
            </Stack>
          </Stack>
        ) : null}

        {showWatchAccount ? (
          <Stack p={4}>
            <Typography variant="h3">
              {translate('dev_settings.watch_account')}
            </Typography>
            <Typography variant="h3">
              {translate('dev_settings.account_name')}
            </Typography>
            <Input onChangeText={setAccountName} value={accountName} />
            <Typography variant="h3">
              {translate('dev_settings.account_address')}
            </Typography>
            <Input onChangeText={setAccountAddress} value={accountAddress} />
            <Stack pt={2}>
              <Button
                onPress={async () => {
                  if (!accountName) {
                    showToast({
                      message: translate('dev_settings.invalid_account_name'),
                      type: 'error',
                    });
                  }

                  if (!accountAddress) {
                    showToast({
                      message: translate(
                        'dev_settings.invalid_account_address',
                      ),
                      type: 'error',
                    });
                  }

                  onAddAccount({
                    name: accountName,
                    address: accountAddress,
                  }).then(() => {
                    setShowWatchAccount(false);
                  });
                }}>
                {translate('dev_settings.watch_account')}
              </Button>
              <Stack pt={3}>
                <Button
                  onPress={() => setShowWatchAccount(false)}
                  colorScheme="tertiary">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Stack>
        ) : null}

        <Stack p={5} />
      </Content>
    </ScreenContainer>
  );
}

export function DevSettingsContainer() {
  const dispatch = useDispatch();

  const handleNetworkChange = networkId => {
    return dispatch(appOperations.setNetwork(networkId));
  };

  const handleAddAccount = ({address, name}) => {
    return dispatch(accountOperations.watchAccount({address, name}));
  };

  return (
    <DevSettingsScreen
      onNetworkChange={handleNetworkChange}
      onAddAccount={handleAddAccount}
    />
  );
}
