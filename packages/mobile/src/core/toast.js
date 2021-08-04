import React from 'react';
import {
  Text,
  CheckCircleIcon,
  ExclamationCircle,
  XCircleIcon,
  Theme,
} from '../design-system';
import {
  Stack,
} from 'native-base';
import { Pressable } from 'react-native';

let toast;


export function setToast(t) {
  toast = t;
}

const typeMap = {
  success: {
    icon: () => <CheckCircleIcon />,
    bg: '#27272A',
  },
  error: {
    icon: () => <XCircleIcon />,
    bg: Theme.colors.gray,
  }
}

export const withErrorToast = (fn) => async (...params) => {
  try {
    await fn(...params);
  } catch(err) {
    showUnexpectedErrorToast();
    throw err;
  }
}

export function showUnexpectedErrorToast() {
  showToast({
    message: 'Unexpected error, please try again',
    type: 'error',
  })
}

export function showToast({
  message,
  type = 'success',
}) {
    toast.show({
      duration: 2000,
      placement: 'top',
      isClosable: true,
      render: (props) => {
        const typeProps = typeMap[type] || typeMap.success;
        return (
          <Pressable onPress={toast.closeAll}>
            <Stack bg={typeProps.bg} px={6} py={4} rounded="md" mb={5} direction="row">
                {typeProps.icon()}
              <Text ml={2} fontWeight={600} fontSize={14}>{message}</Text>
            </Stack>
          </Pressable>
        );
      },
    });
  
}