import {
  Picker,
  Header,
  Footer,
  Content,
  Button,
  Text,
  Container,
  Spinner,
  View,
  Form,
  Item,
  Label,
  Input,
  Grid,
  Row,
  Col,
  H2,
  Icon,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Dimensions, InteractionManager, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Colors} from '../../theme/colors';
import {walletsOperations, walletsSelectors} from './wallets-slice';

export function WalletPicker({
  address,
  password,
  onAddressChange,
  onPasswordChange,
  error,
}) {
  const wallets = useSelector(walletsSelectors.getItems);

  return (
    <Form>
      <Item picker>
        <Picker
          note
          mode="dropdown"
          style={{width: Dimensions.get('screen').width, height: 70}}
          iosIcon={<Icon name="arrow-down" />}
          placeholder="Select a wallet"
          placeholderStyle={{color: '#333'}}
          selectedValue={address}
          onValueChange={onAddressChange}>
          {wallets.map(wallet => (
            <Picker.Item
              label={
                Platform.OS === 'ios' ? (
                  <View style={{paddingTop: 8, paddingLeft: 12}}>
                    <Text style={{fontWeight: 'bold'}}>{wallet.meta && wallet.meta.name}</Text>
                    <Text style={{color: '#555', fontSize: 12}}>
                      {wallet.address}
                    </Text>
                  </View>
                ) : `${wallet.meta && wallet.meta.name}: ${wallet.address}`
              }
              value={wallet.address}
              key={wallet.address}
            />
          ))}
        </Picker>
      </Item>
      {address ? (
        <Item floatingLabel>
          <Label>Enter the password</Label>
          <Input
            onChangeText={onPasswordChange}
            value={password}
            secureTextEntry={true}
            error={error}
          />
        </Item>
      ) : null}
    </Form>
  );
}

export function UnlockWalletScreen() {
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState();
  const walletLoading = useSelector(walletsSelectors.getLoading);
  const wallets = useSelector(walletsSelectors.getItems);
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const handlePasswordChange = value => setPassword(value);

  const handleCreateWallet = () => {
    navigate(Routes.CREATE_WALLET);
  };
  const handleUnlockWallet = async () => {
    setError(null);
    setLoading(true);

    InteractionManager.runAfterInteractions(() => {
      dispatch(
        walletsOperations.unlockWallet({address: selectedAddress, password}),
      )
        .then(() => {
          setPassword(null);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setError('Invalid password, please try again.');
        });
    });
  };

  useEffect(() => {
    if (walletLoading) {
      return;
    }

    if (!wallets) {
      navigate(Routes.CREATE_WALLET);
      return;
    }

    if (!selectedAddress) {
      setSelectedAddress(wallets[0].address);
    }
  }, [wallets, walletLoading]);

  if (!wallets || walletLoading) {
    return (
      <Container>
        <Content>
          <ScreenSpinner />
        </Content>
      </Container>
    );
  }

  return (
    <Container testID="unlockWalletScreen">
      <Header style={{alignItems: 'center', marginTop: 10}}>
        <H2 style={{color: '#fff'}}>Select a Wallet</H2>
      </Header>
      <Content>
        <WalletPicker
          password={password}
          address={selectedAddress}
          onPasswordChange={handlePasswordChange}
          onAddressChange={v => setSelectedAddress(v)}
          error={error}
        />
        <View style={{padding: 20}}>
          {<Text style={{color: Colors.red}}>{error}</Text>}
        </View>
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8, height: 120}}>
        <Grid>
          <Row>
            <Col>
              <Button
                testID="unlockWalletBtn"
                full
                style={{width: '100%'}}
                primary
                onPress={handleUnlockWallet}
                isDisabled={!selectedAddress || loading}>
                {loading ? (
                  <Spinner color="#fff" size={15} />
                ) : (
                  <Text style={{color: '#fff'}}>Unlock Wallet</Text>
                )}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                testID="createWalletBtn"
                full
                style={{width: '100%'}}
                bordered
                onPress={handleCreateWallet}>
                <Text style={{color: Colors.darkBlue}}>Create new wallet</Text>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                full
                style={{width: '100%'}}
                bordered
                onPress={() => navigate(Routes.BACKUP_LOAD)}>
                <Text style={{color: Colors.darkBlue}}>Load from backup</Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Footer>
    </Container>
  );
}
