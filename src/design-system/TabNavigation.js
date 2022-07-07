import type {FeatureFlags} from '../features/app/feature-flags';
import {useFeatures} from '../features/app/feature-flags';
import {Routes} from '../core/routes';
import {translate} from '../locales';
import {
  MenuCredentialsIcon,
  MenuScanQRIcon,
  MenuSettingsIcon,
  MenuTokensIcon,
  DIDManagementIcon,
} from '../assets/icons';
import React, {useContext, useMemo} from 'react';
import {NavigationContext} from '../core/NavigationContext';
import {Pressable, Stack, Text} from 'native-base';
import {navigate} from '../core/navigation';
import {Theme} from './theme';

const getMenuOptions = (features: FeatureFlags) =>
  [
    {
      id: 'tokens',
      route: Routes.ACCOUNTS,
      name: translate('app_navigation.tokens'),
      Icon: MenuTokensIcon,
    },
    features.credentials && {
      id: 'credentials',
      route: Routes.APP_CREDENTIALS,
      name: translate('app_navigation.credentials'),
      Icon: MenuCredentialsIcon,
    },
    {
      id: 'scan-qr',
      route: Routes.APP_QR_SCANNER,
      name: translate('app_navigation.scan'),
      Icon: MenuScanQRIcon,
    },
    features.didManagement && {
      id: 'did-management',
      route: Routes.DID_MANAGEMENT_LIST,
      name: translate('app_navigation.did_management'),
      Icon: DIDManagementIcon,
    },
    {
      id: 'settings',
      route: Routes.APP_SETTINGS,
      name: translate('app_navigation.settings'),
      Icon: MenuSettingsIcon,
    },
  ].filter(opt => !!opt);

export function TabNavigation() {
  const navContext = useContext(NavigationContext);
  const currentTab = navContext.currentTab;
  const {features} = useFeatures();

  const menuOptions = useMemo(() => getMenuOptions(features), [features]);

  return (
    <Stack direction="row" pt={5}>
      {menuOptions.map(option => (
        <Pressable
          key={option.id}
          flex={1}
          onPress={() => navigate(option.route)}
          justifyContent={'center'}
          alignItems={'center'}>
          <option.Icon
            color={
              option.id === currentTab
                ? Theme.colors.info2
                : Theme.colors.description
            }
          />
          <Text fontSize="11px" mt={1}>
            {option.name}
          </Text>
        </Pressable>
      ))}
    </Stack>
  );
}
