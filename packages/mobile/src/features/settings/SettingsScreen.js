import {
  Content,
  Text,
  Container,
  View,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Toast,
} from 'native-base';
import React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Colors} from '../../theme/colors';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletsOperations} from '../wallets/wallets-slice';
import ExitApp from 'react-native-exit-app';
import { walletConnectOperations } from '../wallet-connect/wallet-connect-slice';

const Divier = styled(View)`
  margin: 20px 0;
  border: 0 solid #ccc;
  border-bottom-width: 1px;
`;

export function SettingsScreen({navigation}) {
  const dispatch = useDispatch();

  const handleBackup = () => {
    dispatch(walletsOperations.exportJSON());
    Toast.show({
      text: 'JSON copied to clipboard!',
      buttonText: 'Ok',
      duration: 3000,
    });
  };

  return (
    <Container style={{backgroundColor: Colors.darkBlue}}>
      <Content>
        <List>
          <ListItem onPress={() => navigate(Routes.UNLOCK_WALLET)}>
            <Left>
              <Icon
                name="repeat-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Switch Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigate(Routes.CREATE_WALLET)}>
            <Left>
              <Icon
                name="add-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Create new Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => dispatch(walletConnectOperations.clearSessions())}>
            <Left>
              <Icon
                name="save-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Clear Wallet Connect</Text>
            </Left>
            <Right>
              <Icon name="close-circle-outline" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigate(Routes.BACKUP_CREATE)}>
            <Left>
              <Icon
                name="save-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Create Backup</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={handleBackup}>
            <Left>
              <Icon
                name="save-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Export JSON</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => dispatch(walletsOperations.deleteWallet())}>
            <Left>
              <Icon
                name="trash-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Delete Wallet</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem onPress={() => ExitApp.exitApp()}>
            <Left>
              <Icon
                name="close-circle-outline"
                style={{color: 'white', marginRight: 12}}
              />
              <Text style={{color: 'white'}}>Close App</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" />
            </Right>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}
