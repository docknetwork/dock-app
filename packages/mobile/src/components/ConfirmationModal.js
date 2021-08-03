import React, {useEffect, useState} from 'react';
import {Button, Modal, Stack, Text, View} from 'native-base';
import {AlertModalIcon, InfoModalIcon, Theme} from 'src/design-system';

let globalController;

export function showConfirmationModal(configs) {
  globalController.setVisible(false);
  globalController.setConfigs(configs);
  globalController.setVisible(true);
}

export function ConfirmationModal() {
  const [visible, setVisible] = useState(false);
  const [configs, setConfigs] = useState({});

  const handleCancel = () => {
    setVisible(false);

    if (configs.onCancel) {
      configs.onCancel();
    }
  };

  const handleConfirm = () => {
    setVisible(false);

    if (configs.onConfirm) {
      configs.onConfirm();
    }
  };

  useEffect(() => {
    globalController = {
      setVisible,
      setConfigs,
    };
  }, []);

  return (
    <Modal
      backgroundColor={Theme.colors.backdrop}
      isOpen={visible}
      onClose={handleCancel}>
      <Modal.Content backgroundColor={Theme.colors.modalBackground} px={5} py={7}>
        <Stack alignItems="center">
          <Stack
            borderRadius={50}
            backgroundColor={
              configs.type === 'info' ? Theme.colors.info : Theme.colors.error
            }
            width={44}
            height={44}
            justifyContent="center"
            alignItems="center">
            {configs.type === 'info' ? <InfoModalIcon /> : <AlertModalIcon />}
          </Stack>
          <Text
            mt={4}
            fontSize={20}
            fontWeight={600}
            fontFamily={Theme.fontFamily.montserrat}>
            {configs.title}
          </Text>
          <Text mt={4} fontSize={14} fontWeight={400}>
            {configs.description}
          </Text>
          <Button
            mt={4}
            size="sm"
            width="100%"
            onPress={handleConfirm}
            bg={
              configs.type === 'info' ? Theme.colors.info2 : Theme.colors.error
            }>
            {configs.confirmText}
          </Button>
          <Button
            mt={2}
            size="sm"
            width="100%"
            variant="solid"
            onPress={handleCancel}
            bg={Theme.colors.tertiaryBackground}>
            {configs.cancelText}
          </Button>
        </Stack>
      </Modal.Content>
    </Modal>
  );
}
