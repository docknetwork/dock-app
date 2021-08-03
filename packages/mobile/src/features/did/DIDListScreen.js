import {
  Footer,
  Content,
  Button,
  Text,
  Container,
  List,
  ListItem,
  Left,
  Right,
  Icon,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {didOperations, didSelectors} from './did-slice';
import { DIDEditModal } from './DIDEditModal';
import { DIDDetailsModal } from './DIDDetailsModal';

export function DIDListScreen() {
  const dispatch = useDispatch();
  const items = useSelector(didSelectors.getItems);
  const isLoading = useSelector(didSelectors.getLoading);
  const [didDoc, setDidDoc] = useState();
  const [showEditModal, setShowEditModal] = useState();

  const handleCreate = () => {
    dispatch(didOperations.createDID());
  };

  const handleDelete = () => {
    dispatch(didOperations.removeDID(didDoc));
    setDidDoc(null);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  useEffect(() => {
    dispatch(didOperations.fetch());
  }, []);

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <List>
            {(items || []).map(item => (
              <ListItem onPress={() => setDidDoc(item)}>
                <Left>
                  <Text style={{color: '#444', fontSize: 14}}>{item.id}</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            ))}
          </List>
        )}
        {showEditModal ? (
          <DIDEditModal
            didDoc={didDoc}
            onClose={() => setShowEditModal(false)}
            items={items}
          />
        ) : null}
        {!showEditModal && didDoc ? (
          <DIDDetailsModal
            onClose={() => setDidDoc(null)}
            didDoc={didDoc}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleCreate}>
          <Text style={{color: '#fff'}}>Create DID</Text>
        </Button>
      </Footer>
    </Container>
  );
}
