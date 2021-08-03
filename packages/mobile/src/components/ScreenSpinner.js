import React from 'react';
import { Spinner, Text } from "native-base";
import { View } from "react-native";
import { Colors } from '../theme/colors';

export function ScreenSpinner() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}>
      <Spinner color={Colors.darkBlue} />
    </View>
  );
}
