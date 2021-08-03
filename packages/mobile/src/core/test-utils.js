import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { ThemeProvider } from "../design-system"

export const renderAppProviders = (component) => {
  return (
    <NativeBaseProvider theme={{}}>
      {component}
    </NativeBaseProvider>
  );
}
