import Clipboard from '@react-native-community/clipboard';
import {
  Footer,
  Content,
  Text,
  Container,
  View,
  Button,
  Toast,
} from 'native-base';
import React from 'react';
import {RefreshControl} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Colors} from '../../theme/colors';
import {credIssuanceOperations} from '../credential-issuance/cred-issuance-slice';
import {walletsOperations, walletsSelectors} from '../wallets/wallets-slice';

export function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const wallet = useSelector(walletsSelectors.getCurrentWallet);
  const balance = useSelector(walletsSelectors.getBalance);
  const isLoading = useSelector(walletsSelectors.getLoading);

  return (
    <Container>
      <Content
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              dispatch(walletsOperations.fetchBalance());
            }}
            refreshing={isLoading}
            colors={[Colors.darkBlue]}
            tintColor={Colors.darkBlue}
          />
        }>
        <TouchableHighlight
          onPress={() => {
            Clipboard.setString(wallet.address);

            Toast.show({
              text: 'Address copied to clipboard!',
              buttonText: 'Ok',
              duration: 3000,
            });
          }}>
          <View
            style={{
              backgroundColor: '#eee',
              padding: 12,
              alignItems: 'center',
            }}>
            <Text style={{color: '#333', fontWeight: 'bold', marginBottom: 8}}>
              {wallet.meta.name}
            </Text>
            <Text style={{color: '#333', fontSize: 12, marginBottom: 8}}>
              {wallet.address}
            </Text>
            <Text style={{color: '#333', fontWeight: 'bold', marginBottom: 8}}>
              {balance || ''}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={{padding: 12}}>
          <View style={{marginBottom: 12}}>
            <Button onPress={() => navigate(Routes.APP_SEND_TOKENS)} full>
              <Text style={{color: '#fff'}}>Send/Receive tokens</Text>
            </Button>
          </View>
          <View style={{marginBottom: 12}}>
            <Button onPress={() => navigate(Routes.APP_DID)} full>
              <Text style={{color: '#fff'}}>Manage DIDs</Text>
            </Button>
          </View>
          <View style={{marginBottom: 12}}>
            <Button onPress={() => navigate(Routes.APP_CREDENTIAL)} full>
              <Text style={{color: '#fff'}}>Manage Credentials</Text>
            </Button>
          </View>
          <View style={{marginBottom: 12}}>
            <Button
              onPress={() => dispatch(credIssuanceOperations.example())}
              full>
              <Text style={{color: '#fff'}}>Credential Issuance</Text>
            </Button>
          </View>
          <View style={{marginBottom: 12}}>
            <Button
              onPress={() => navigate(Routes.APP_PRESENTATION_EXCHANGE)}
              full>
              <Text style={{color: '#fff'}}>Presentation Exhcnage</Text>
            </Button>
          </View>
          <View style={{marginBottom: 12}}>
            <Button
              onPress={() => navigate(Routes.APP_PRESENTATION_EXCHANGE)}
              full>
              <Text style={{color: '#fff'}}>Credentials Demo</Text>
            </Button>
          </View>
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        {
          // navigation menu
        }
      </Footer>
    </Container>
  );
}
