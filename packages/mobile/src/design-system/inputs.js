import React, {useState} from 'react';
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Input as NBInput,
  Popover,
  Pressable,
  Stack,
  Text,
} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {ErrorAlert, InformationCircle} from '../assets/icons';
import {Modal} from '../components/Modal';
import {Button} from './buttons';
import {Theme} from './theme';
import {Typography} from './typography';

export {Select, Input, Text} from 'native-base';

export function SelectToggler({children, placeholder}) {
  const [contentVisible, setContentVisible] = useState();

  return (
    <Box>
      <TouchableWithoutFeedback
        onPress={() => setContentVisible(value => !value)}>
        <Stack
          backgroundColor="#27272A"
          mt={8}
          width={0.67}
          direction="row"
          alignItems="center"
          pl={5}
          pr={2}
          py="1px"
          borderRadius={6}>
          <Box flex={1}>
            <Typography variant="label">
              {placeholder}
            </Typography>
          </Box>
          <Box mt={2}>
            {contentVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        </Stack>
      </TouchableWithoutFeedback>
      {contentVisible ? <Box>{children}</Box> : null}
    </Box>
  );
}

export function InputError({form, id}) {
  const errorMessage = form._errors[id];

  if (!errorMessage) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="center">
      <Box mt={2} mr={2}>
        <ErrorAlert />
      </Box>
      <Text mt={2} color={Theme.colors.errorText}>
        {errorMessage}
      </Text>
    </Stack>
  );
}

export function InputPopover({children, title, okText = 'Got it'}) {
  const [visible, setVisible] = useState(false);
  const handleClose = () => setVisible(false);

  return (
    <>
      <Pressable alignSelf="center" onPress={() => setVisible(true)}>
        <Box px={2} py={0.5}>
          <InformationCircle />
        </Box>
      </Pressable>
      <Modal visible={visible} onClose={handleClose}>
        <Stack p={5}>
          <Text
            fontSize="24px"
            fontWeight={600}
            fontFamily={Theme.fontFamily.montserrat}
            color={Theme.colors.textHighlighted}>
            {title}
          </Text>
          <Stack>
            <Text mt={4}>{children}</Text>
          </Stack>
          <Button onPress={handleClose} mt={5}>
            {okText}
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
