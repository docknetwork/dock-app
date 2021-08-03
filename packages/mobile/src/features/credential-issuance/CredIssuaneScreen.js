import {
  Footer,
  Content,
  Button,
  Text,
  Container,
  View,
  Item,
  Label,
  Input,
  H1,
  Picker,
  Icon,
  H2,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {
  credIssuanceOperations,
  credIssuanceSelectors,
} from './cred-issuance-slice';
import jp from 'jsonpath';
import { Dimensions } from 'react-native';
import { didSelectors } from '../did/did-slice';
import { credentialOperations } from '../credentials/credential-slice';
import styled from 'styled-components/native';

const DetailsWrapper = styled(View)`
  margin-top: 22px;
  margin-bottom: 2px;
  border: 0px solid #ccc;
  border-bottom-width: 1px;
  padding-bottom: 22px;
`;

export function CredIssuanceScreen() {
  const dispatch = useDispatch();
  const manifest = useSelector(credIssuanceSelectors.getManifest);
  const schema = useSelector(credIssuanceSelectors.getSchema);
  const dids = useSelector(didSelectors.getItems);
  const isLoading = useSelector(credIssuanceSelectors.getLoading);
  const properties =
    (manifest && manifest.output_descriptors[0].display.properties) || [];
  const [form, setForm] = useState({});

  const handleFormChange = path => newValue => {
    const newForm = {...form};
    jp.value(newForm, path, newValue);
    setForm(newForm);
  };

  const handleSubmit = () => {
    dispatch(credIssuanceOperations.submitCredential(form))
  };

  const displayProps = manifest && manifest.output_descriptors[0].display || {}

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <View style={{ margin: 10 }}>
            <H1>{displayProps.title && displayProps.title.text}</H1>
            <View style={{ marginTop: 10 }}>
              <Text>{displayProps.description && displayProps.description.text}</Text>
            </View>
            <DetailsWrapper>
              <Text>Issuer: {manifest.issuer.name}</Text>
            </DetailsWrapper>
            {properties.map(item => {
              if (item.label === 'DID') {
                return (
                  <View>
                    <Picker
                      note
                      mode="dropdown"
                      style={{
                        width: Dimensions.get('screen').width,
                        height: 80,
                      }}
                      iosIcon={<Icon name="arrow-down" />}
                      placeholder="Select a DID"
                      placeholderStyle={{color: '#333'}}
                      selectedValue={jp.value(form, item.path[0])}
                      onValueChange={handleFormChange(item.path[0])}>
                      {dids.map(item => (
                        <Picker.Item
                          label={
                            <View style={{paddingTop: 8, paddingLeft: 5}}>
                              <Text style={{color: '#555'}}>{item.id}</Text>
                            </View>
                          }
                          value={item.id}
                          key={item.id}
                        />
                      ))}
                    </Picker>
                  </View>
                );
              }
              return (
                <Item floatingLabel>
                  <Label>{item.label}</Label>
                  <Input
                    onChangeText={handleFormChange(item.path[0])}
                    value={jp.value(form, item.path[0])}
                  />
                </Item>
              );
            })}
          </View>
        )}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleSubmit}>
          <Text style={{color: '#fff'}}>Submit</Text>
        </Button>
      </Footer>
    </Container>
  );
}
