import React from 'react';
import {translate} from 'src/locales';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {
  Box,
  Content,
  EmptyCredentialIcon,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
  DotsVerticalIcon,
} from '../../design-system';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import {addTestId} from '../../core/automation-utils';
import {Center, Image, Text, Stack, Menu, Pressable} from 'native-base';
import {useCredentials, getObjectFields, getDIDAddress} from './credentials';
import {withErrorBoundary} from 'src/core/error-handler';
import {formatDate, isValidDate} from '../../core/format-utils';

function renderObjectAttributes(credential) {
  const objectAttributes = getObjectFields(credential);

  return (
    <>
      {objectAttributes.map(key => {
        const attr = credential.credentialSubject[key];
        return (
          <Stack mb={1}>
            <Text
              textTransform="capitalize"
              fontSize={'12px'}
              fontWeight={600}
              fontFamily={Theme.fontFamily.montserrat}>
              {key}
            </Text>
            {Object.keys(attr).map(attrKey => {
              const item = attr[attrKey];

              return <Text fontSize={'12px'}>{item}</Text>;
            })}
          </Stack>
        );
      })}
    </>
  );
}

function EmptyCredentials(props) {
  return (
    <Center {...props}>
      <Box borderRadius={72} width={72} height={72} backgroundColor={'#27272A'}>
        <Center h="100%" width="100%">
          <EmptyCredentialIcon color={Theme.colors.description} />
        </Center>
      </Box>
      <Text
        fontSize={14}
        pt={2}
        fontWeight={400}
        fontFamily={Theme.fontFamily.default}>
        {translate('credentials.empty_items')}
      </Text>
    </Center>
  );
}

const CredentialListItem = withErrorBoundary(({credential, onRemove}) => {
  return (
    <NBox
      bgColor={Theme.colors.credentialCardBg}
      p={4}
      borderRadius={10}
      m={2}
      key={`${credential.id}`}>
      <Stack direction="row">
        <Stack>
          {credential.credentialSubject.title ? (
            <Text
              fontSize={'16px'}
              fontWeight={600}
              fontFamily={Theme.fontFamily.montserrat}>
              {credential.credentialSubject.title}
            </Text>
          ) : null}
          <Text
            fontSize={'12px'}
            fontWeight={500}
            fontFamily={Theme.fontFamily.montserrat}>
            {credential.credentialSubject.subjectName}
          </Text>
          {renderObjectAttributes(credential)}
        </Stack>
        <NBox flex={1} alignItems="flex-end">
          <Menu
            trigger={triggerProps => {
              return (
                <Pressable
                  p={2}
                  {...triggerProps}
                  _pressed={{
                    opacity: Theme.touchOpacity,
                  }}>
                  <DotsVerticalIcon />
                </Pressable>
              );
            }}>
            <Menu.Item onPress={() => onRemove(credential)}>
              {translate('account_list.delete_account')}
            </Menu.Item>
          </Menu>
        </NBox>
      </Stack>

      <NBox mt={4} flexDirection="row" alignItems={'flex-end'}>
        <NBox>
          <Text
            fontSize={'11px'}
            fontWeight={500}
            fontFamily={Theme.fontFamily.montserrat}>
            {formatDate(credential.issuanceDate)}
          </Text>
        </NBox>
        <NBox flex={1} alignItems={'flex-end'}>
          {credential.issuer.logo ? (
            <Image
              borderRadius={8}
              width={50}
              height={50}
              alt={''}
              source={{
                uri: credential.issuer.logo,
              }}
            />
          ) : (
            <PolkadotIcon
              address={getDIDAddress(credential.issuer.id)}
              size={32}
            />
          )}
        </NBox>
      </NBox>
    </NBox>
  );
});

export function CredentialsScreen({credentials, onRemove, onAdd}) {
  return (
    <ScreenContainer {...addTestId('CredentialsScreen')} showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('credentials.title')}
            </Typography>
          </Box>
          <Box row>
            <IconButton onPress={onAdd} col>
              <PlusCircleWhiteIcon />
            </IconButton>
          </Box>
        </Box>
      </Header>
      <Content>
        {credentials.length ? (
          credentials.map(item => (
            <CredentialListItem
              key={item.id}
              credential={item.content}
              onRemove={() => onRemove(item)}
            />
          ))
        ) : (
          <EmptyCredentials mt={'50%'} />
        )}
      </Content>
    </ScreenContainer>
  );
}

export function CredentialsContainer(props) {
  const {credentials, handleRemove, onAdd} = useCredentials();
  return (
    <CredentialsScreen
      credentials={credentials}
      onRemove={handleRemove}
      onAdd={onAdd}
    />
  );
}
