import React from 'react';
import styled from 'styled-components/native';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Clipboard from '@react-native-community/clipboard';
import {RNCamera} from 'react-native-camera';
import {Colors} from '../../theme/colors';
import {navigate, navigateBack} from '../../core/navigation';
import {useDispatch} from 'react-redux';
import {qrCodeOperations} from './qrcode-slice';
import { Routes } from '../../core/routes';

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.darkBlue};
`;

const Header = styled.View`
  height: 80px;
  width: 100%;
  padding-top: 10px;
`;

const Title = styled.Text`
  color: ${Colors.white};
  font-size: 18px;
  line-height: 24px;
  width: 100%;
  text-align: center;
`;

const IconContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 10px;
  padding: 20px;
  z-index: 99999;
`;

const Footer = styled.View`
  display: flex;
  justify-content: center;
  background: #2e3945;
  border-radius: 4px;
  margin: 20px;
  height: 93px;
`;

const Description = styled.Text`
  color: ${Colors.white};
  font-size: 18px;
  text-align: center;
`;

const SmallDescription = styled.Text`
  color: ${Colors.white};
  font-size: 13px;
  text-align: center;
`;

const Body = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.SafeAreaView`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const QRCodeContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export function QRScanScreen({ route }) {
  const { onData } = route.params;

  return (
    <Container>
      <QRCodeContainer>
        <QRCodeScanner
          style={{flex: 1}}
          reactivate={true}
          reactivateTimeout={10000}
          flashMode={RNCamera.Constants.FlashMode.torch}
          cameraStyle={{height: Dimensions.get('window').height}}
          topViewStyle={{
            height: 0,
            flex: 0,
          }}
          bottomViewStyle={{
            height: 0,
            flex: 0,
          }}
          onRead={event => onData(event.data)}
        />
      </QRCodeContainer>
      <Wrapper>
        <Header>
          <Title>Scan QR Code</Title>
          <IconContainer>
            <TouchableWithoutFeedback
              onPress={navigateBack}
              style={{padding: 20}}>
              <Text style={{ color: 'white' }}>Back</Text>
            </TouchableWithoutFeedback>
          </IconContainer>
        </Header>
        <Body>
          <View style={{width: 240, height: 230}}>
            <View
              style={{
                width: 60,
                height: 60,
                borderStyle: 'solid',
                borderColor: '#00C0D9',
                borderLeftWidth: 12,
                borderTopWidth: 12,
                position: 'absolute',
                left: 0,
                top: 0,
              }}
            />
            <View
              style={{
                width: 60,
                height: 60,
                borderStyle: 'solid',
                borderColor: '#00C0D9',
                borderRightWidth: 12,
                borderTopWidth: 12,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
            <View
              style={{
                width: 60,
                height: 60,
                borderStyle: 'solid',
                borderColor: '#00C0D9',
                borderRightWidth: 12,
                borderBottomWidth: 12,
                position: 'absolute',
                right: 0,
                bottom: 0,
              }}
            />
            <View
              style={{
                width: 60,
                height: 60,
                borderStyle: 'solid',
                borderColor: '#00C0D9',
                borderLeftWidth: 12,
                borderBottomWidth: 12,
                position: 'absolute',
                left: 0,
                bottom: 0,
              }}
            />
          </View>
        </Body>
        <TouchableWithoutFeedback
          onPress={async () => {
            const text = await Clipboard.getString();
            onData(text);
          }}>
          <Footer>
            <Description>Scan the QR Code</Description>
            <SmallDescription>Place the code inside the box</SmallDescription>
          </Footer>
        </TouchableWithoutFeedback>
      </Wrapper>
    </Container>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
