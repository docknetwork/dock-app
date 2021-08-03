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
import {credentialActions, credentialOperations, credentialSelectors} from './credential-slice';
import {CredentialDetailsModal} from './CredentialDetailsModal';

export function CredentialListScreen() {
  const dispatch = useDispatch();
  const items = useSelector(credentialSelectors.getItems);
  const isLoading = useSelector(credentialSelectors.getLoading);
  const [credentialDoc, setCredentialDoc] = useState();
  const handleCreate = () => {
    dispatch(credentialOperations.createCredential());
  };

  const handleRevocation = () => {
    dispatch(credentialOperations.revokeCredential(credentialDoc));
    // setCredentialDoc(null);
  };
  
  const handleVerification = () => {
    dispatch(credentialOperations.verifyCredential(credentialDoc));
    // setCredentialDoc(null);
  };
  
  const handleRemove = () => {
    dispatch(credentialActions.removeItem(credentialDoc));
    setCredentialDoc(null);
  };

  useEffect(() => {
    dispatch(credentialOperations.fetch());
  }, []);

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <List>
            {(items || []).map(item => (
              <ListItem onPress={() => setCredentialDoc(item)}>
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
        {/* {showEditModal ? (
          <CredentialEditModal
            credentialDoc={credentialDoc}
            onClose={() => setShowEditModal(false)}
            items={items}
          />
        ) : null} */}
        {credentialDoc ? (
          <CredentialDetailsModal
            onClose={() => setCredentialDoc(null)}
            credentialDoc={credentialDoc}
            onRevoke={handleRevocation}
            onVerify={handleVerification}
            onRemove={handleRemove}
          />
        ) : null}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleCreate}>
          <Text style={{color: '#fff'}}>Issue Credential</Text>
        </Button>
      </Footer>
    </Container>
  );
}
