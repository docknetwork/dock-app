import React from 'react';
import {
  Text,
  CheckCircleIcon,
  ExclamationCircle,
} from '../design-system';
import {
  Stack,
} from 'native-base';

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
    icon: () => <ExclamationCircle />,
    bg: '#F87171',
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
      render: () => {
        const typeProps = typeMap[type] || typeMap.success;
        return (
          <Stack bg={typeProps.bg} px={6} py={4} rounded="md" mb={5} direction="row">
            {typeProps.icon()}
            <Text ml={2} fontWeight={600} fontSize={14}>{message}</Text>
          </Stack>
        );
      },
    });
  
}