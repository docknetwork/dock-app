import {Button as NButton, Spinner, Stack, Text} from 'native-base';
import React, {useState, useEffect, useRef} from 'react';
import {InteractionManager, Platform, TouchableHighlight} from 'react-native';
import {translate} from 'src/locales';
import {Typography} from '.';
import BackIcon from '../assets/icons/back.svg';
import {navigateBack} from '../core/navigation';
import {Box} from './grid';
import {Theme} from './theme';
import {addTestId} from '../core/automation-utils';

export const Group = NButton.Group;

export const runAfterInteractions =
  Platform.OS === 'ios'
    ? InteractionManager.runAfterInteractions
    : cb => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(cb, 100);
        });
      };

export const useAsyncCallback = func => {
  const isActive = useRef(true);
  const [loading, setLoading] = useState();
  const callback = () => {
    setLoading(true);
    runAfterInteractions(() => {
      Promise.resolve(func()).finally(() => {
        // if (isActive.current) {
        setLoading(false);
        // }
      });
    });
  };

  useEffect(() => {
    return () => {
      isActive.current = false;
    };
  }, []);

  return [loading, callback];
};

export function BackButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress || navigateBack);

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', onPress);
  //   return () => BackHandler.removeEventListener('hardwareBackPress', onPress);
  // }, [onPress]);

  return (
    <Box
      flexDirection="row"
      onPress={onPress}
      {...(props.testID ? addTestId(props.testID) : {})}>
      {loading ? (
        <Spinner size={12} />
      ) : (
        <>
          <BackIcon />
          <Typography variant="description" marginLeft={2}>
            {translate('navigation.back')}
          </Typography>
        </>
      )}
    </Box>
  );
}

export function IconButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return (
    <Box col {...props}>
      <TouchableHighlight onPress={onPress}>
        {loading ? <Spinner size={12} /> : props.children}
      </TouchableHighlight>
    </Box>
  );
}

export function LoadingButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return <Button {...props} onPress={onPress} isLoading={loading} />;
}

export function BigButton({icon, children, ...props}) {
  const [loading, onPress] = useAsyncCallback(props.onPress);

  return (
    <Box
      row
      borderWidth={1}
      borderColor="#3F3F46"
      borderRadius={8}
      padding={25}
      marginBottom={12}
      alignItems="center"
      {...props}
      onPress={onPress}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Box autoSize col>
            {icon}
          </Box>
          <Box>
            <Text
              fontSize={14}
              fontFamily={Theme.fontFamily.default}
              fontWeight="600"
              color="#fff">
              {children}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
}

export function Button(props) {
  let {children, icon, ...otherProps} = props;

  if (!otherProps.bg && otherProps.isDisabled) {
    otherProps.bg = '#1E75C5';
  }

  if (otherProps.variant === 'ghost') {
    otherProps._text = {
      fontWeight: 400,
      color: Theme.colors.textHighlighted,
    };
  }

  return (
    <NButton {...otherProps}>
      <Stack direction="row">
        {icon && <Box marginRight={15}>{icon}</Box>}
        <Text>{children}</Text>
      </Stack>
    </NButton>
  );
}

Button.Group = NButton.Group;
