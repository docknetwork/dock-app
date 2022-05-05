import {Box, Pressable, Stack, Switch} from 'native-base';
import React from 'react';
import {ChevronRightIcon, Text, Theme} from 'src/design-system';

export function OptionList({items, postPress, ...otherProps}) {
  return (
    <Box {...otherProps}>
      {items.map(({title, onPress, icon, testID, isSwitch, value}, idx) => (
        <Pressable
          key={idx}
          _pressed={{
            opacity: Theme.touchOpacity,
          }}
          testID={testID}
          onPress={async () => {
            if (isSwitch) {
              return;
            }

            if (onPress) {
              await onPress();
            }

            if (postPress) {
              postPress();
            }
          }}>
          <Stack direction="row" py={5}>
            {icon}
            <Box pl={5} flex={1}>
              <Text
                fontSize="16px"
                fontWeight={600}
                color="#fff"
                fontFamily={Theme.fontFamily.default}>
                {title}
              </Text>
            </Box>
            {isSwitch ? (
              <Box top={-5}>
                <Switch isChecked={value} onToggle={onPress} />
              </Box>
            ) : (
              <ChevronRightIcon />
            )}
          </Stack>
        </Pressable>
      ))}
    </Box>
  );
}
