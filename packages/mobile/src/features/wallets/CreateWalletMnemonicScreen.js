import {
  H1,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
  View,
} from 'native-base';
import React from 'react';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import styled from 'styled-components/native';

const WordBox = styled(View)`
  padding: 8px;
  background-color: #e0e0e0;
  margin: 2px;
`;

export function CreateWalletMnemonicScreen({navigation, route}) {
  const mnemonic = route.params.mnemonic;
  const handleComplete = () => {
    navigate(Routes.APP_HOME);
  };

  return (
    <Container>
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <H1 style={{color: 'white'}}>Backup your Wallet</H1>
      </Header>
      <Content padder>
        <Text style={{fontWeight: 'bold', marginBottom: 12}}>
          Please copy your mnemonic phrase
        </Text>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {mnemonic.split(' ').map(word => (
            <WordBox>
              <Text>{word}</Text>
            </WordBox>
          ))}
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleComplete}>
          <Text style={{color: '#fff'}}>Complete</Text>
        </Button>
      </Footer>
    </Container>
  );
}
