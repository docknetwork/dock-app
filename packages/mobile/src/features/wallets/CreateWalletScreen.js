import {
  Form,
  H1,
  Input,
  Item,
  Label,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
  View,
  Spinner,
} from 'native-base';
import React, {useState} from 'react';
import {InteractionManager} from 'react-native';
import {useDispatch} from 'react-redux';
import {Colors} from '../../theme/colors';
import {walletsOperations} from './wallets-slice';

export function CreateWalletScreen({navigation}) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    walletName: null,
    password: null,
    confirmPassword: null,
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const handleFormChange = key => value =>
    setForm({
      ...form,
      [key]: value,
    });

  const handleCreateWallet = () => {
    if (!form.password || !form.walletName) {
      setError('Please enter the required fields');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation doesn't match");
      return;
    }

    setLoading(true);

    InteractionManager.runAfterInteractions(() => {
      dispatch(
        walletsOperations.createWallet({
          password: form.password,
          walletName: form.walletName,
        }),
      ).then(() => {
        setLoading(false);
      });
    });
  };

  return (
    <Container testID="createWalletScreen">
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <H1 style={{color: '#fff'}}>Create Wallet</H1>
      </Header>
      <Content>
        <Form>
          <Item floatingLabel>
            <Label>Wallet name</Label>
            <Input
              onChangeText={handleFormChange('walletName')}
              value={form.walletName}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              secureTextEntry={true}
              onChangeText={handleFormChange('password')}
              value={form.password}
            />
          </Item>
          <Item floatingLabel last>
            <Label>Confirm Password</Label>
            <Input
              secureTextEntry={true}
              onChangeText={handleFormChange('confirmPassword')}
              value={form.confirmPassword}
            />
          </Item>
        </Form>
        <View style={{padding: 20}}>
          {<Text style={{color: Colors.red}}>{error}</Text>}
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button
          testID="createWalletBtn"
          full
          style={{width: '100%'}}
          primary
          isDisabled={loading}
          onPress={handleCreateWallet}>
          {loading ? (
            <Spinner color="#fff" size={15} />
          ) : (
            <Text style={{color: '#fff'}}>Create Wallet</Text>
          )}
        </Button>
      </Footer>
    </Container>
  );
}
