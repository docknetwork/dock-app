import {
  Button,
  Text,
  H1,
  View,
  Icon,
  Row,
  Grid,
  Col,
  Picker,
} from 'native-base';
import React, {useState} from 'react';
import {Modal} from '../../components/Modal';
import {Colors} from '../../theme/colors';
import {Dimensions} from 'react-native';
// import {DetailsValue} from './DIDDetailsModal';
import {useDispatch, useSelector} from 'react-redux';
// import {didOperations} from './did-slice';
import {
  walletConnectOperations,
  walletConnectSelectors,
} from './wallet-connect-slice';

export function ConfirmConnectionModal({items, onClose}) {
  const dispatch = useDispatch();
  const confirmConnection = useSelector(
    walletConnectSelectors.getConfirmConnection,
  );
  const isModalVisible = !!confirmConnection;

  const handleConfirm = () =>
    dispatch(walletConnectOperations.confirmConnection(true));

  if (!isModalVisible) {
    return null;
  }

  return (
    <Modal visible={isModalVisible} onClose={onClose}>
      <Grid>
        <Row
          style={{
            alignItems: 'center',
            height: 70,
            backgroundColor: Colors.darkBlue,
            padding: 10,
          }}>
          {/* <Col style={{width: 50}}>
            <Button transparent onPress={onClose}>
              <Icon name="chevron-back-outline" style={{color: 'white'}} />
            </Button>
          </Col> */}
          <Col>
            <H1 style={{color: '#fff'}}>Wallet Connect</H1>
          </Col>
        </Row>
        {confirmConnection ? (
          <Row style={{padding: 10, flex: 1}}>
            <Col>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 22}}>
                  {confirmConnection.peerMeta.name}
                </Text>
                <Text style={{marginTop: 12}}>
                  Want's to connect to your wallet
                </Text>
                <Text style={{fontWeight: '300', fontSize: 14, marginTop: 12}}>
                  {confirmConnection.peerMeta.description}
                </Text>
              </View>
              <View></View>
            </Col>
          </Row>
        ) : null}
        <Row style={{padding: 10, height: 100}}>
          <Col>
            <View style={{marginTop: 12}}>
              <Button full onPress={handleConfirm}>
                <Text style={{color: 'white'}}>Confirm Connection</Text>
              </Button>
            </View>
          </Col>
        </Row>
      </Grid>
    </Modal>
  );
}
