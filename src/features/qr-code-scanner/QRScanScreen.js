import Clipboard from '@react-native-community/clipboard';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Theme} from 'src/design-system';
import styled from 'styled-components/native';
import {navigateBack} from '../../core/navigation';
import {Colors} from '../../theme/colors';

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

export function QRScanScreen({route}) {
  const {onData} = route.params;

  return (
    <Container>
      <QRCodeContainer>
        <QRCodeScanner
          style={styles.scanner}
          reactivate={true}
          reactivateTimeout={10000}
          flashMode={RNCamera.Constants.FlashMode.off}
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
              <Text style={{color: Theme.colors.textHighlighted}}>Back</Text>
            </TouchableWithoutFeedback>
          </IconContainer>
        </Header>
        <Body>
          <View style={{width: 240, height: 230}}>
            <View style={[styles.frame, styles.frameLeftTop]} />
            <View style={[styles.frame, styles.frameRightTop]} />
            <View style={[styles.frame, styles.frameLeftBottom]} />
            <View style={[styles.frame, styles.frameRightBottom]} />
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
  scanner: {
    flex: 1,
  },
  frame: {
    width: 60,
    height: 60,
    borderStyle: 'solid',
    borderColor: '#00C0D9',
    borderLeftWidth: 12,
    borderTopWidth: 12,
    position: 'absolute',
  },
  frameLeftTop: {
    left: 0,
    top: 0,
  },
  frameRightTop: {
    right: 0,
    top: 0,
  },
  frameLeftBottom: {
    left: 0,
    bottom: 0,
  },
  frameRightBottom: {
    right: 0,
    bottom: 0,
  },
});
