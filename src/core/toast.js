import {captureException} from '@sentry/react-native';
import {Stack} from 'native-base';
import React from 'react';
import {Pressable} from 'react-native';
import {translate} from 'src/locales';
import {CheckCircleIcon, Text, XCircleIcon} from '../design-system';
import {Theme} from '../design-system/theme';

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
    bg: Theme.colors.primaryBackground,
  },
  message: {
    icon: () => null,
    bg: Theme.colors.primaryBackground,
  },
};

export const withErrorToast =
  (fn, message) =>
  async (...params) => {
    try {
      await fn(...params);
    } catch (err) {
      captureException(err);
      showUnexpectedErrorToast(message || getErrorMessageFromErrorObject(err));
      throw err;
    }
  };

export function showUnexpectedErrorToast(
  message = translate('global.unexpected_error'),
) {
  showToast({
    message,
    type: 'error',
  });
}
export function getErrorMessageFromErrorObject(err) {
  if (typeof err === 'string') {
    if (err.indexOf('AssertionError') > -1) {
      return err.substring(16, err.length - 1).trim();
    }
    return err.trim();
  } else if (err?.message && typeof err.message === 'string') {
    return getErrorMessageFromErrorObject(err.message);
  }
  return translate('global.unexpected_error');
}
export function showToast({message, type = 'success', duration = 2000}) {
  if (!toast) {
    return;
  }

  toast.show({
    duration,
    placement: 'top',
    isClosable: true,
    render: props => {
      const typeProps = typeMap[type] || typeMap.success;

      return (
        <Pressable
          onPress={toast.closeAll}
          _pressed={{
            opacity: Theme.touchOpacity,
          }}>
          <Stack
            bg={typeProps.bg}
            px={6}
            py={4}
            rounded="md"
            mb={5}
            direction="row">
            {typeProps.icon()}
            <Text ml={2} fontWeight={600} fontSize={14}>
              {message}
            </Text>
          </Stack>
        </Pressable>
      );
    },
  });
}
