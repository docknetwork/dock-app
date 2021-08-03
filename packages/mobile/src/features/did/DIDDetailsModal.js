import {Button, H1, Icon, Row, Grid, Col, View, Text} from 'native-base';
import React from 'react';
import {Modal} from '../../components/Modal';
import {Colors} from '../../theme/colors';

export function DetailsValue({label, value}) {
  return (
    <View style={{marginBottom: 12}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <Text style={{color: '#666', fontSize: 13}}>{value}</Text>
    </View>
  );
}

export function DIDDetailsModal({onClose, didDoc, onEdit, onDelete}) {
  return (
    <Modal visible={true} onClose={onClose}>
      <Grid>
        <Row
          style={{
            alignItems: 'center',
            height: 70,
            backgroundColor: Colors.darkBlue,
            padding: 10,
          }}>
          <Col>
            <H1 style={{color: '#fff'}}>DID Details</H1>
          </Col>
          <Col style={{width: 120, flexDirection: 'row'}}>
            <Button transparent onPress={onEdit} style={{marginRight: 8}}>
              <Icon name="pencil" style={{color: 'white'}} />
            </Button>
            <Button transparent onPress={onDelete}>
              <Icon name="trash" style={{color: 'white'}} />
            </Button>
          </Col>
        </Row>
        <Row style={{padding: 10, marginTop: 8}}>
          <Col>
            <DetailsValue label="Id" value={didDoc.id} />

            <DetailsValue
              label="Authentication"
              value={didDoc.authentication}
            />

            <DetailsValue
              label="Assertion Method"
              value={didDoc.assertionMethod}
            />

            <DetailsValue
              label="Controller"
              value={didDoc.publicKey[0].controller}
            />
            <DetailsValue
              label="Public Key Type"
              value={didDoc.publicKey[0].type}
            />
            <DetailsValue
              label="Public Key Base58"
              value={didDoc.publicKey[0].publicKeyBase58}
            />
          </Col>
        </Row>
      </Grid>
    </Modal>
  );
}
