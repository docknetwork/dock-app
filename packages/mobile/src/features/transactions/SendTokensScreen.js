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
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {walletsSelectors} from '../wallets/wallets-slice';
import { transactionsOperations, transactionsSelectors } from './transactions-slice';

const DetailsWrapper = styled(View)`
  margin-top: 22px;
  margin-bottom: 2px;
  border: 0px solid #ccc;
  border-bottom-width: 1px;
  padding-bottom: 22px;
`;

export function SendTokensScreen() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    addressTo: ''
  });
  const isLoading = useSelector(transactionsSelectors.getLoading);
  const handleFormChange = key => newValue => {
    setForm({
      ...form,
      [key]: newValue,
    });
  };

  const balance = useSelector(walletsSelectors.getBalance);

  const handleSubmit = () => {
    dispatch(transactionsOperations.sendTokens(form))
  };

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <View style={{margin: 10}}>
            <H1>Send tokens</H1>
            <Item floatingLabel style={{ marginTop: 20 }}>
              <Label>Send to address</Label>
              <Input
                onChangeText={handleFormChange('addressTo')}
                value={form.addressTo}
              />
            </Item>
            <Item floatingLabel style={{ marginTop: 20 }}>
              <Label>Amount</Label>
              <Input
                onChangeText={handleFormChange('amount')}
                value={form.amount}
              />
            </Item>
            <Text style={{ marginTop: 18 }}>{balance} available</Text>
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
