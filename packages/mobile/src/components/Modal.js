import { Box, Stack } from 'native-base';
import React from 'react';
import { Dimensions, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Theme } from '../design-system';

export function Modal({onClose = () => {}, children, modalSize = 0.42, visible}) {
  const screenHeight = Dimensions.get('screen').height;

  return (
    <RNModal
      isVisible={visible}
      onSwipeComplete={() => onClose(null)}
      swipeDirection={['down']}
      onBackdropPress={() => onClose(null)}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <View
        style={{
          backgroundColor: Theme.colors.modalBackground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: screenHeight * modalSize,
          width: '100%',
        }}>
        <Stack alignItems="center" mt={6}>
          <Box width="36px" height="4px" backgroundColor={Theme.colors.tertiaryBackground} borderRadius="4px"/>
        </Stack>
        {children}
      </View>
    </RNModal>
  );
}
