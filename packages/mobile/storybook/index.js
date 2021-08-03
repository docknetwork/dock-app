import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import {getStorybookUI, configure, addDecorator} from '@storybook/react-native';
// import {NativeBaseProvider} from 'native-base';
import {withKnobs} from '@storybook/addon-knobs';
import {ThemeProvider} from '../src/design-system';
import SplashScreen from 'react-native-splash-screen';

import './rn-addons';

SplashScreen.hide();


const AppProvider = ({children}) => {
  useEffect(() => {
    // app stuff
  }, []);

  return children;
};

// enables knobs for all stories
addDecorator(withKnobs);
addDecorator(getStory => (
  <AppProvider>
    <ThemeProvider>{getStory()}</ThemeProvider>
  </AppProvider>
));

// import stories
configure(() => {
  require('../src/stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you should remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
