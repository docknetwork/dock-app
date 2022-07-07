import React from 'react';
import {
  BigButton,
  Box,
  Footer,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {addTestId} from '../../core/automation-utils';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import {RoundedDIDIcon} from '../../assets/icons';
import {Button, ScrollView} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {Icon, VStack} from 'native-base';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';

export function DIDListScreen() {
  return (
    <ScreenContainer testID="DIDListScreen" showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('app_navigation.did_management')}
            </Typography>
          </Box>
          <Box row>
            <IconButton
              col
              {...addTestId('DIDListScreen_Add_DID')}
              onPress={() => {
                navigate(Routes.DID_MANAGEMENT_NEW_DID);
              }}>
              <PlusCircleWhiteIcon />
            </IconButton>
          </Box>
        </Box>
      </Header>
      <ScrollView marginLeft={26} marginRight={26}>
        <NBox mt={70}>
          <VStack space={7} alignItems="center">
            <RoundedDIDIcon />
            <Typography mt={3} textAlign="center" variant="didDescription">
              {translate('didManagement.did_definition')}
            </Typography>
            <Button
              onPress={null}
              isActive={false}
              endIcon={<Icon as={Ionicons} name="open-outline" size="xs" />}
              variant={'transactionFilter'}
              size={'xs'}>
              <Typography
                variant="transaction-filter"
                color={Theme.colors.inactiveText}>
                {translate('didManagement.learn_more')}
              </Typography>
            </Button>
          </VStack>
        </NBox>
      </ScrollView>
      <Footer marginBottom={114} marginLeft={3} marginRight={3} flex={1}>
        <BigButton
          {...addTestId('CreateNewDID')}
          onPress={null}
          icon={<PlusCircleIcon />}>
          {translate('didManagement.create_new_did')}
        </BigButton>
        <BigButton
          {...addTestId('ImportExistingDIDBtn')}
          onPress={null}
          icon={<DocumentDownloadIcon />}>
          {translate('didManagement.import_existing_did')}
        </BigButton>
      </Footer>
    </ScreenContainer>
  );
}
export function DIDListScreenContainer() {
  return <DIDListScreen />;
}
