import React, {useState} from 'react';
import {InteractionManager, Platform} from 'react-native';
import {Button as NButton, Text, Box as NBox, Spinner} from 'native-base';
import BackIcon from '../assets/icons/back.svg';
import {navigateBack} from '../core/navigation';
import {Box} from './grid';
import {Typography} from '.';
import {Theme} from './theme';
import {translate} from 'src/locales';

export const runAfterInteractions =
  Platform.OS === 'ios'
    ? InteractionManager.runAfterInteractions
    : cb => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(cb, 100);
        });
      };

export const useAsyncCallback = func => {
  const [loading, setLoading] = useState();
  const callback = () => {
    setLoading(true);
    runAfterInteractions(() => {
      Promise.resolve(func()).finally(() => {
        setLoading(false);
      });
    });
  };

  return [loading, callback];
};

export function BackButton(props) {
  const [loading, onPress] = useAsyncCallback(props.onPress || navigateBack);

  return (
    <Box flexDirection="row" onPress={onPress} testID={props.testID}>
      {loading ? (
        <Spinner size={12} />
      ) : (
        <>
          <BackIcon />
          <Typography variant="description" marginLeft={6}>
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
    <Box col {...props} onPress={onPress}>
      {loading ? <Spinner size={12} /> : props.children}
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
              fontFamily="Nunito Sans"
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
      {icon && <Box marginRight={15}>{icon}</Box>}
      {children}
    </NButton>
  );
}
