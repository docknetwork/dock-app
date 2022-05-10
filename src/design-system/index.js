import {Box, Stack} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {appSelectors} from 'src/features/app/app-slice';
import {translate} from 'src/locales';
import styled from 'styled-components/native';
import {Theme} from './theme';
import {Typography} from './typography';
import {TabNavigation} from './TabNavigation';
import {isAndroid} from './platform-utils';

function ConnectionStatus({status, loadingText, errorText}) {
  if (!status && loadingText) {
    return (
      <Stack bg={Theme.colors.info} p={2}>
        <Typography color={Theme.colors.info2}>{loadingText}</Typography>
      </Stack>
    );
  }

  if (status instanceof Error && errorText) {
    return (
      <Stack bg={Theme.colors.error} p={2}>
        <Typography color={Theme.colors.errorText}>{errorText}</Typography>
      </Stack>
    );
  }

  return null;
}

export function AppGlobalHeader() {
  const dockApiReady = useSelector(appSelectors.getDockReady);
  const rpcReady = useSelector(appSelectors.getRpcReady);

  return (
    <>
      <ConnectionStatus
        status={rpcReady}
        errorText={translate('global.webview_connection_error')}
      />
      <ConnectionStatus
        status={dockApiReady}
        loadingText={translate('global.substrate_connection_loading')}
        errorText={translate('global.substrate_connection_error')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Theme.screen.backgroundColor,
  },
});

export function ScreenContainer({
  children,
  hideGlobalHeader,
  showTabNavigation,
  ...props
}) {
  return (
    <SafeAreaView {...props} style={styles.screenContainer}>
      {hideGlobalHeader ? null : <AppGlobalHeader />}
      <Box flex={1}>
        <Box flex={1}>{children}</Box>
        {showTabNavigation ? (
          <Box flex={1} flexGrow={isAndroid() ? 0.15 : 0.11}>
            <TabNavigation />
          </Box>
        ) : null}
      </Box>
    </SafeAreaView>
  );
}

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = styled(Box)``;
export const Content = styled(ScrollView)`
  flex: 1;
`;

export const Image = styled.Image``;

export * from '../assets/icons';
export * from './buttons';
export * from './grid';
export * from './inputs';
export * from './list';
export * from './LoadingScreen';
export * from './theme';
export * from './typography';
