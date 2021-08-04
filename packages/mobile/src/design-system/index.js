import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Box } from './grid';
import { Theme } from './theme';

export const ScreenContainer = styled.SafeAreaView`
  background-color: ${Theme.colors.primaryBackground};
  flex: 1;
`;

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = Box;
export const Content = styled.ScrollView`
  flex: 1;
`;

export const Image = styled.Image`
  position: relative;
`;

export * from '../assets/icons';
export * from './buttons';
export * from './grid';
export * from './inputs';
export * from './list';
export * from './LoadingScreen';
export * from './theme';
export * from './typography';

