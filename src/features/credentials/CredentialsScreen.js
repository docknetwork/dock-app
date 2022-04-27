import React from 'react';
import {translate} from 'src/locales';
import {navigate} from '../../core/navigation';
import {
  BackButton,
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
import {ICenterProps} from 'native-base/lib/typescript/components/composites/Center/types';
import {useCredentials, getObjectFields} from './credentials';
import {formatDate} from '@docknetwork/wallet-sdk-core/lib/core/format-utils';
import {Routes} from 'src/core/routes';

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

function EmptyCredentials(props: ICenterProps) {
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
        fontFamily={Theme.fontFamily.nunitoSans}>
        {translate('credentials.empty_items')}
      </Text>
    </Center>
  );
}

function CredentialListItem({credential, onRemove}) {
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
          <Image
            borderRadius={8}
            width={50}
            height={50}
            alt={''}
            source={{
              uri: credential.issuer.logo,
            }}
          />
        </NBox>
      </NBox>
    </NBox>
  );
}

export function CredentialsScreen({credentials, onRemove, onAdd}) {
  return (
    <ScreenContainer {...addTestId('CredentialsScreen')} showTabNavigation>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton onPress={() => navigate(Routes.ACCOUNTS)} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">
              {translate('credentials.title')}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end">
            <IconButton onPress={onAdd} col>
              <PlusCircleWhiteIcon />
            </IconButton>
          </NBox>
        </Box>
      </Header>
      <Content>
        {credentials.length ? (
          credentials.map(item => (
            <CredentialListItem
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
