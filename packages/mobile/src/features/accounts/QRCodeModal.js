import { Box, Stack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Modal } from '../../components/Modal';
import { DockLogoIcon, Typography } from '../../design-system';

export function QRCodeModal({onClose, visible, data, title, description}) {
  const qrSize = Dimensions.get('window').width * 0.8;

  return (
    <Modal visible={visible} onClose={onClose} modalSize={0.6}>
      <Stack p={8}>
        <Typography variant="h1">{title}</Typography>
        <Typography>{description}</Typography>
        <Box mt={8} alignItems="center" height={qrSize}>
          <QRCode value={data} logo={DockLogoIcon} size={qrSize} />
        </Box>
      </Stack>
    </Modal>
  );
}
