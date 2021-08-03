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
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
// import {
//   credIssuanceOperations,
//   credIssuanceSelectors,
// } from './cred-issuance-slice';
import jp from 'jsonpath';
import {Dimensions} from 'react-native';
import {didSelectors} from '../did/did-slice';
import {
  credentialOperations,
  credentialSelectors,
} from '../credentials/credential-slice';
import {walletConnectOperations, walletConnectSelectors} from '../wallet-connect/wallet-connect-slice';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';

export function PresentationExchangeScreen() {
  const dispatch = useDispatch();
  const credentials = useSelector(credentialSelectors.getItems);
  const request = useSelector(walletConnectSelectors.getRequest);
  const [selected, setSelected] = useState();
  const [isLoading, setLoading] = useState();
  const type = request && request.params[0] && request.params[0].type;
  const handleSubmit = () => {
    dispatch(
      walletConnectOperations.sendMessage({
        method: 'presentation_submission',
        params: [credentials.find(item => item.id === selected), type],
      }),
    );
    
    navigate(Routes.APP_HOME)
  };

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <View style={{ margin: 10 }}>
            <H1>Presentation Exchange</H1>
            <Text style={{ marginTop: 10 }}>Please select a credential of type: {type}</Text>
            <View>
              <Picker
                note
                mode="dropdown"
                style={{
                  width: Dimensions.get('screen').width,
                  height: 100,
                }}
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select a credential"
                placeholderStyle={{color: '#333'}}
                selectedValue={selected}
                onValueChange={v => setSelected(v)}>
                {credentials.map(item => (
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
