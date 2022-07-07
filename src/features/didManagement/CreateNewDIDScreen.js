import React, {useCallback} from 'react';
import {
  BackButton,
  Box,
  Header,
  Input,
  LoadingButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {navigateBack} from '../../core/navigation';
import {
  FormControl,
  HStack,
  Icon,
  ScrollView,
  Select,
  Stack,
  VStack,
} from 'native-base';
import {translate} from '../../locales';
import {DIDAdvancedOptions} from './components/DIDAdvancedOptions';
import {Ionicons} from '@native-base/icons';

export function CreateNewDIDScreen() {
  const onChange = useCallback(() => {}, []);
  return (
    <ScreenContainer testID="CreateNewDIDScreen" showTabNavigation>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton onPress={navigateBack} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">
              {translate('didManagement.create_new_did')}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <ScrollView marginLeft={5} marginRight={5}>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_name')}
            </FormControl.Label>
            <Input
              value={''}
              onChangeText={onChange('word1')}
              autoCapitalize="none"
            />
            <FormControl.HelperText>
              {translate('didManagement.did_name_input_hint')}
            </FormControl.HelperText>
          </Stack>
        </FormControl>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_type')}
            </FormControl.Label>
            <Select>
              <Select.Item label="did:key" value="didkey" />
              <Select.Item label="did:dock" value="diddock" />
            </Select>
          </Stack>
        </FormControl>
        <VStack
          mt={7}
          px={5}
          py={5}
          style={{
            backgroundColor: Theme.colors.bgBlue,
            borderRadius: Theme.borderRadius,
          }}>
          <HStack>
            <HStack
              style={{
                flexGrow: 1,
              }}>
              <Icon as={Ionicons} name="information-circle-outline" />
              <Typography ml={1} variant="h3">
                {' ' + translate('didManagement.quick_info')}
              </Typography>
            </HStack>
            <Icon as={Ionicons} name="close-outline" />
          </HStack>
          <Typography mt={3} textAlign="left" variant="didDescription">
            {translate('didManagement.did_dock_info')}
          </Typography>

          <Typography my={2} color={Theme.colors.inactiveText}>
            {translate('didManagement.learn_more') + ' '}
            <Icon as={Ionicons} name="open-outline" size="xs" />
          </Typography>
        </VStack>
        <DIDAdvancedOptions onChange={onChange} form={{}} />
        <LoadingButton
          full
          testID="next-btn"
          mt={70}
          onPress={null}
          isDisabled={false}>
          {translate('didManagement.create')}
        </LoadingButton>
      </ScrollView>
    </ScreenContainer>
  );
}
export function CreateNewDIDScreenContainer() {
  return <CreateNewDIDScreen />;
}
