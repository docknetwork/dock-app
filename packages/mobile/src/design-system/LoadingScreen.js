import React, {useEffect} from 'react';
import {
  Header,
  // Button,
  Footer,
  Content,
  Text,
  ScreenContainer,
  Typography,
  Box,
  NBox,
  BigButton,
  DotsVerticalIcon,
  CheckCircleIcon,
  IconButton,
  AlertIcon,
  BackButton,
} from './index';
import {
  Avatar,
  Button,
  ChevronLeftIcon,
  Divider,
  Menu,
  Pressable,
  Stack,
  useToast,
} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';

export function LoadingScreen({}) {
  return (
    <ScreenContainer testID="LoadingScreen">
      <Header>
      </Header>
      <Content marginLeft={26} marginRight={26}>
          <Typography>Loading...</Typography>
     </Content>
    </ScreenContainer>
  );
}