import {Box, Pressable, Stack} from 'native-base';
import React from 'react';
import {ChevronRightIcon, Text} from 'src/design-system';

export function OptionList({items, postPress, ...otherProps}) {
  return (
    <Box {...otherProps}>
      {items.map(({title, onPress, icon, testID}, idx) => (
        <Pressable
          key={idx}
          testID={testID}
          onPress={async () => {
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
                fontFamily="Montserrat">
                {title}
              </Text>
            </Box>
            <ChevronRightIcon />
          </Stack>
        </Pressable>
      ))}
    </Box>
  );
}
