import {Menu, Pressable, ScrollView, Stack} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, RefreshControl} from 'react-native';
import RNExitApp from 'react-native-exit-app';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {addTestId} from 'src/core/automation-utils';
import {withErrorBoundary} from 'src/core/error-handler';
import {formatCurrency} from 'src/core/format-utils';
import {Routes} from 'src/core/routes';
import {translate} from 'src/locales';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {
  AlertIcon,
  BigButton,
  Box,
  Button,
  ChevronRightIcon,
  DotsVerticalIcon,
  Footer,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {createAccountOperations} from '../account-creation/create-account-slice';
import {TokenAmount} from '../tokens/ConfirmTransactionModal';
import {accountOperations, accountSelectors} from './account-slice';
import {AddAccountModal} from './AddAccountModal';
import {AccountsScreenTestIDs} from './test-ids';
import {pickDocuments} from '../../core/storage-utils';
import {useNavigation} from '@react-navigation/native';
export function displayWarning(account) {
  if (
    account.hasBackup === false ||
    (account.meta && account.meta.keypairNotFoundWarning)
  ) {
    return true;
  }
  return false;
}
export const AccountsScreen = withErrorBoundary(
  ({
    accounts = [],
    onAddAccount,
    onImportExistingAccount,
    onDelete,
    onDetails,
    onRefresh,
    isRefreshing,
  }) => {
    const isEmpty = accounts.length === 0;
    const [showAddAccount, setShowAddAccount] = useState();
    const [showImportAccount, setShowImportAccount] = useState();
    const {navigate} = useNavigation();

    return (
      <ScreenContainer testID={AccountsScreenTestIDs.screen} showTabNavigation>
        <Header>
          <Box
            marginLeft={22}
            marginRight={22}
            flexDirection="row"
            alignItems="center">
            <Box flex={1}>
              <Typography
                fontFamily="Montserrat"
                fontSize={24}
                fontWeight="600">
                {translate('account_list.title')}
              </Typography>
            </Box>
            <Box row>
              <IconButton
                col
                {...addTestId(AccountsScreenTestIDs.addAccountMenuBtn)}
                onPress={() => setShowAddAccount(true)}>
                <PlusCircleWhiteIcon />
              </IconButton>
            </Box>
          </Box>
        </Header>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          <Stack mx={26} flex={1}>
            {isEmpty ? (
              <Box flex={1} justifyContent="center" alignItems="center">
                <Typography marginTop={12}>
                  {translate('account_list.empty_accounts')}
                </Typography>
              </Box>
            ) : (
              <NBox>
                {accounts.map(account => {
                  return (
                    <Stack
                      key={account.id}
                      direction="row"
                      borderRadius={12}
                      backgroundColor={Theme.colors.secondaryBackground}
                      space={2}
                      mb={4}
                      py={6}
                      px={6}>
                      <Stack direction="column" flex={1}>
                        <Stack direction="row" alignItems="center">
                          <Pressable
                            _pressed={{
                              opacity: Theme.touchOpacity,
                            }}
                            onPress={() => onDetails(account)}
                            flex={1}>
                            <Stack direction="row" flex={1} alignItems="center">
                              <PolkadotIcon address={account.id} size={32} />
                              <Stack direction="row" flex={1} ml={3}>
                                <Typography
                                  color={Theme.colors.textHighlighted}
                                  fontWeight={600}>
                                  {account.name}
                                </Typography>
                                <ChevronRightIcon marginTop={1} />
                              </Stack>
                            </Stack>
                          </Pressable>
                          <NBox py={1} px={1}>
                            <Stack direction="row">
                              {displayWarning(account) ? (
                                <NBox mr={3} mt={1}>
                                  <AlertIcon />
                                </NBox>
                              ) : null}
                              <Menu
                                trigger={triggerProps => {
                                  return (
                                    <Pressable
                                      {...triggerProps}
                                      _pressed={{
                                        opacity: Theme.touchOpacity,
                                      }}>
                                      <DotsVerticalIcon />
                                    </Pressable>
                                  );
                                }}>
                                <Menu.Item onPress={() => onDetails(account)}>
                                  {translate('account_list.account_details')}
                                </Menu.Item>
                                <Menu.Item onPress={() => onDelete(account)}>
                                  {translate('account_list.delete_account')}
                                </Menu.Item>
                              </Menu>
                            </Stack>
                          </NBox>
                        </Stack>

                        <TokenAmount amount={account.balance}>
                          {({
                            fiatAmount,
                            fiatSymbol,
                            tokenAmount,
                            tokenSymbol,
                          }) => (
                            <>
                              <Stack direction="column" mt={4}>
                                <Typography variant="h2">
                                  {tokenAmount} {tokenSymbol}
                                </Typography>
                                <Typography fontSize="14px">
                                  {formatCurrency(fiatAmount)}
                                </Typography>
                              </Stack>
                            </>
                          )}
                        </TokenAmount>

                        <Stack direction="row" mt={4}>
                          {
                            <Button
                              width="50%"
                              size="sm"
                              disabled={account.readOnly}
                              colorScheme="dark"
                              {...addTestId('TokenSend')}
                              onPress={() => {
                                navigate(Routes.TOKEN_SEND, {
                                  address: account.id,
                                });
                              }}>
                              {translate('account_list.send_token')}
                            </Button>
                          }
                          <Button
                            width="50%"
                            size="sm"
                            ml={2}
                            colorScheme="dark"
                            {...addTestId('TokenReceive')}
                            onPress={() => {
                              navigate(Routes.TOKEN_RECEIVE, {
                                address: account.id,
                              });
                            }}>
                            {translate('account_list.receive_token')}
                          </Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                })}
              </NBox>
            )}
          </Stack>
        </ScrollView>
        {isEmpty ? (
          <Footer marginBottom={114} marginLeft={26} marginRight={26} flex={1}>
            <BigButton
              {...addTestId('CreateNewAccount')}
              onPress={onAddAccount}
              icon={<PlusCircleIcon />}>
              Create new account
            </BigButton>
            <BigButton
              {...addTestId('ImportExistingBtn')}
              onPress={() => {
                setShowImportAccount(true);
                setShowAddAccount(true);
              }}
              icon={<DocumentDownloadIcon />}>
              {translate('add_account_modal.import_existing')}
            </BigButton>
          </Footer>
        ) : null}
        <AddAccountModal
          visible={showAddAccount}
          showImportAccount={showImportAccount}
          onClose={() => {
            setShowImportAccount(false);
            setShowAddAccount(false);
          }}
          onAddAccount={onAddAccount}
          onImportExistingAccount={onImportExistingAccount}
        />
      </ScreenContainer>
    );
  },
);

export const AccountsContainer = withErrorBoundary(({navigation}) => {
  const {navigate} = navigation;
  const dispatch = useDispatch();
  const accounts = useSelector(accountSelectors.getAccounts);
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(accountOperations.fetchBalances()).finally(() => {
      setRefreshing(false);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(accountOperations.loadAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      navigation.addListener('beforeRemove', e => {
        RNExitApp.exitApp();
        e.preventDefault();
      });
    }
  }, [navigation]);

  return (
    <AccountsScreen
      onDelete={accountId => {
        dispatch(accountOperations.removeAccount(accountId));
      }}
      onDetails={account => {
        navigate(Routes.ACCOUNT_DETAILS, {
          id: account.id,
        });
      }}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
      accounts={accounts}
      onAddAccount={() => {
        dispatch(accountOperations.addAccountFlow());
      }}
      onImportExistingAccount={async method => {
        if (method === 'mnemonic') {
          navigate(Routes.ACCOUNT_IMPORT_FROM_MNEMONIC);
        } else if (method === 'qrcode') {
          navigate(Routes.APP_QR_SCANNER, {
            onData: data => {
              dispatch(createAccountOperations.importFromJson(data));
            },
          });
        } else if (method === 'json') {
          const files = await pickDocuments();

          if (!files.length) {
            return;
          }

          const fileData = await RNFS.readFile(files[0].fileCopyUri);

          dispatch(createAccountOperations.importFromJson(fileData));
        }
      }}
    />
  );
});
