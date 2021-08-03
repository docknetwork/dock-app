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
} from 'native-base';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {
  backupActions,
  backupOperations,
  backupSelectors,
} from './wallet-backup-slice';

export function LoadBackupScreen() {
  const dispatch = useDispatch();
  const keyInfo = useSelector(backupSelectors.getKeyInfo);
  const isLoading = useSelector(backupSelectors.getLoading);
  const [fileName, setFileName] = useState('wallet-backup.json');
  const [password, setPassword] = useState();

  const handleFormChange = key => newValue => {
    dispatch(
      backupActions.setKeyInfo({
        ...keyInfo,
        [key]: newValue,
      }),
    );
  };

  const handleSubmit = () => {
    dispatch(backupOperations.loadWalletBackup({fileName, password}));
  };

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <View style={{margin: 10}}>
            <H1>Backup wallet</H1>
            <Item floatingLabel style={{marginTop: 20}}>
              <Label>Key</Label>
              <Input
                onChangeText={handleFormChange('key')}
                value={keyInfo.key}
              />
            </Item>
            <Item floatingLabel style={{marginTop: 20}}>
              <Label>Secret</Label>
              <Input
                onChangeText={handleFormChange('secret')}
                value={keyInfo.secret}
              />
            </Item>
            <Item floatingLabel style={{marginTop: 20}}>
              <Label>File name</Label>
              <Input onChangeText={v => setFileName(v)} value={fileName} />
            </Item>
            <Item floatingLabel style={{marginTop: 20}}>
              <Label>Password</Label>
              <Input
                onChangeText={v => setPassword(v)}
                value={password}
                secureTextEntry={true}
              />
            </Item>
          </View>
        )}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleSubmit}>
          <Text style={{color: '#fff'}}>Load Backup</Text>
        </Button>
      </Footer>
    </Container>
  );
}
