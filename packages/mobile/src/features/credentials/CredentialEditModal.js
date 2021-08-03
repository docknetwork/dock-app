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
import {DetailsValue} from './DIDDetailsModal';
import {useDispatch} from 'react-redux';
import {didOperations} from './did-slice';

export function CredentialEditModal({items, onClose, didDoc}) {
  const dispatch = useDispatch();
  const [newController, setNewController] = useState(
    didDoc.publicKey[0].controller,
  );

  const handleUpdate = () =>
    dispatch(didOperations.updateDID({newController, didDoc})).then(onClose);

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
          <Col style={{width: 50}}>
            <Button transparent onPress={onClose}>
              <Icon name="chevron-back-outline" style={{color: 'white'}} />
            </Button>
          </Col>
          <Col>
            <H1 style={{color: '#fff'}}>Update DID</H1>
          </Col>
        </Row>
        <Row style={{padding: 10, flex: 1}}>
          <Col>
            <DetailsValue label="Id" value={didDoc.id} />
            <Text style={{}}>Controller</Text>
            <Picker
              note
              mode="dropdown"
              style={{width: Dimensions.get('screen').width, height: 100}}
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select a DID"
              placeholderStyle={{color: '#333'}}
              selectedValue={newController}
              onValueChange={v => setNewController(v)}>
              {items.map(item => (
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
            <View style={{marginTop: 12}}>
              <Button full isDisabled={!newController} onPress={handleUpdate}>
                <Text style={{color: 'white'}}>Confirm Update</Text>
              </Button>
            </View>
          </Col>
        </Row>
      </Grid>
    </Modal>
  );
}
