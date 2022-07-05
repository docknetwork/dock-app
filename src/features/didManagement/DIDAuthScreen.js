import {authHandler} from '../qr-code-scanner/qr-code';
import {useIsFocused} from '@react-navigation/native';
import {addTestId} from 'src/core/automation-utils';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Header,
  NBox,
  ScreenContainer,
  Typography,
  Input,
} from '../../design-system';
import {ScrollView} from 'react-native';
import {Button, Spinner, Stack, FormControl, Select} from 'native-base';
import {translate} from '../../locales';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {getOwnedDIDs} from '../credentials/credentials';
import {useWallet} from '@docknetwork/wallet-sdk-react-native/lib';
import queryString from 'query-string';
import {KeyboardAvoidingView, Platform} from 'react-native';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;
// Taken from https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium
const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const nameField = {
  name: 'Name',
  placeholder: 'John Doe',
  type: 'text',
  id: 'name',
};

const knownScopeFields = {
  public: [nameField],
  profile: [nameField],
  user: [nameField],
  email: [
    {
      name: 'Email',
      placeholder: 'johndoe@dock.io',
      type: 'email',
      id: 'email',
      required: true,
    },
  ],
};

function getScopeFields(scope) {
  const scopeSplits = scope.split(' ');
  const result = [];
  scopeSplits.forEach(scopeSplit => {
    const knownFields = knownScopeFields[scopeSplit];
    if (knownFields) {
      result.push(...knownFields);
    }
  });
  return result.filter((item, i) => result.indexOf(item) === i);
}

export function DIDAuthConfirmScreen({
  authenticateDID,
  profileData,
  setProfileData,
  selectedDID,
  setSelectedDID,
  clientInfo,
  dids = [],
}) {
  const [error, setError] = useState();
  const {name, scope} = clientInfo;
  const fields = getScopeFields(scope);

  function handleCancel() {
    navigate(Routes.ACCOUNTS);
  }

  function handleSubmit() {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = profileData[field.id];
      if (field.required && !value) {
        setError(`${field.name} is required`);
        return;
      }

      if (value && field.type === 'email' && !validateEmail(value)) {
        setError(`${field.name} must be a valid email address`);
        return;
      }
    }

    setError(null);
    authenticateDID();
  }

  function handleChangeDID(value) {
    setSelectedDID(value);
  }

  const handleChange = key => value => {
    setProfileData({
      ...profileData,
      [key]: value,
    });
  };

  return (
    <ScreenContainer testID="DIDAuthConfirmScreen">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <Header marginTop={22}>
          <Box
            marginLeft={22}
            marginRight={22}
            flexDirection="row"
            alignItems="center">
            <Box flex={1}>
              <Typography variant="h1" textAlign="center">
                {translate('auth.authorize')} {name}
              </Typography>
            </Box>
          </Box>
        </Header>
        <Stack direction={'column'} mx={4}>
          <NBox mb={50}>
            <Typography textAlign="center" variant="list-description">
              {translate('auth.sign_in_msg')}
            </Typography>
          </NBox>

          <Typography variant="field-label">DID:</Typography>
          <Box marginTop={4}>
            <Select onValueChange={handleChangeDID} selectedValue={selectedDID}>
              {dids.map(didItem => (
                <Select.Item
                  label={didItem.didDoc.didDocument.id}
                  value={didItem.keyDoc}
                />
              ))}
            </Select>
          </Box>

          <FormControl isInvalid={!!error}>
            <Box marginTop={12}>
              {fields.map(field => (
                <>
                  <Typography variant="field-label">{field.name}:</Typography>
                  <Box marginTop={4} marginBottom={12}>
                    <Input
                      placeholder={field.placeholder}
                      {...addTestId(field.name)}
                      value={profileData[field.id]}
                      onChangeText={handleChange(field.id)}
                      autoCapitalize="none"
                      secureTextEntry={field.type === 'password'}
                    />
                  </Box>
                </>
              ))}
            </Box>
            <FormControl.ErrorMessage>{error}</FormControl.ErrorMessage>
          </FormControl>
        </Stack>

        <Stack direction={'row'} mt={'auto'} mx={4} mb={10}>
          <Button.Group
            mx={{
              base: 'auto',
              md: 0,
            }}
            size="md">
            <Button onPress={handleCancel} width="48.5%" colorScheme="dark">
              <Typography>{translate('navigation.cancel')}</Typography>
            </Button>
            <Button
              onPress={handleSubmit}
              disabled={!selectedDID}
              width="48.5%">
              <Typography>{translate('navigation.approve')}</Typography>
            </Button>
          </Button.Group>
        </Stack>
      </ScrollView>
    </ScreenContainer>
  );
}

export function DIDAuthScreen({authState, retry}) {
  return (
    <ScreenContainer testID="DIDAuthScreen">
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('qr_scanner.header')}
            </Typography>
          </Box>
        </Box>
      </Header>
      <Stack direction={'column'} mx={70} mt={40}>
        <NBox mt={15}>
          {authState === 'processing' ? (
            <Spinner />
          ) : (
            <Typography
              style={{
                textAlign: 'center',
              }}
              variant="list-description">
              {translate(`qr_scanner.${authState}`)}
            </Typography>
          )}
        </NBox>
        {authState === 'error' ? (
          <Button onPress={retry} mt={7}>
            <Typography>{translate('qr_scanner.retry')}</Typography>
          </Button>
        ) : null}
      </Stack>
    </ScreenContainer>
  );
}

function extractClientInfo(url) {
  const parsed = queryString.parse(url.substr(url.indexOf('?')));
  const submitUrl = parsed.url || '';
  const submitParsed = queryString.parse(
    submitUrl.substr(submitUrl.indexOf('?')),
  );
  return {
    name: submitParsed.client_name || 'Unnamed App',
    website: submitParsed.client_website,
    scope: submitParsed.scope || 'public',
  };
}

export function DIDAuthScreenContainer({route}) {
  const {dockWalletAuthDeepLink} = route.params || {};
  const isScreenFocus = useIsFocused();
  const {status} = useWallet({syncDocs: true});
  const [authState, setAuthState] = useState('processing');
  const [profileData, setProfileData] = useState({});
  const [selectedDID, setSelectedDID] = useState();
  const [dids, setDIDs] = useState();
  const clientInfo = extractClientInfo(dockWalletAuthDeepLink);

  function handleRetry() {
    setAuthState('start');
  }

  const authenticateDID = useCallback(async () => {
    // TODO: should we store profileData relating to the website that requested it in wallet
    // so that we can prepopulate the fields next time?
    setAuthState('processing');
    const result = await authHandler(
      dockWalletAuthDeepLink,
      selectedDID,
      profileData,
    );
    if (result) {
      setAuthState('completed');
      setTimeout(() => {
        navigate(Routes.ACCOUNTS);
      }, 3000);
    } else {
      setAuthState('error');
    }
  }, [dockWalletAuthDeepLink, selectedDID, profileData]);

  async function loadDIDs() {
    const result = await getOwnedDIDs();
    setDIDs(result);
    if (result.length > 0) {
      setSelectedDID(result[0].keyDoc);
      setAuthState('start');
    } else {
      setAuthState('nodids');
    }
  }

  useEffect(() => {
    if (!dids && isScreenFocus) {
      loadDIDs();
    }
  }, [dids, isScreenFocus, status]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      behavior="padding"
      style={{flex: 1}}>
      {authState === 'start' ? (
        <DIDAuthConfirmScreen
          {...{
            setAuthState,
            authenticateDID,
            profileData,
            setProfileData,
            dids,
            selectedDID,
            setSelectedDID,
            clientInfo,
          }}
        />
      ) : (
        <DIDAuthScreen authState={authState} retry={handleRetry} />
      )}
    </KeyboardAvoidingView>
  );
}
