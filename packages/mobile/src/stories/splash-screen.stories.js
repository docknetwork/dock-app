import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { SplashScreen } from '../features/app/SplashScreen';

storiesOf('App', module)
  .add('Splash Screen', () => (
    <SplashScreen />
  ))
