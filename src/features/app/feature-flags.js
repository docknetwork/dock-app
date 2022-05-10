import {useDispatch, useSelector} from 'react-redux';
import {appOperations, appSelectors} from './app-slice';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

export const Features = {
  showTestnetTransaction: {
    id: 'showTestnetTransaction',
    title: translate('dev_settings.show_testnet_transaction'),
    visible: ({currentNetworkId}) => currentNetworkId !== 'mainnet',
  },
  credentials: {
    id: 'credentials',
    title: translate('dev_settings.show_credentials'),
  },
  transak: {
    id: 'activate_transak',
    title: translate('dev_settings.activate_transak'),
  },
};

export const getAllFeatures = () =>
  Object.keys(Features).map(key => Features[key]);

export const defaultFeatures = {
  [Features.showTestnetTransaction.id]: false,
  [Features.credentials.id]: true,
  [Features.transak.id]: true,
};

export type FeatureFlags = {
  showTestnetTransaction: boolean,
  credentials: boolean,
};

export function useFeatures() {
  const features: FeatureFlags = useSelector(appSelectors.getFeatures);
  const dispatch = useDispatch();

  const updateFeature = (name, value) => {
    dispatch(appOperations.updateFeature(name, value));
    logAnalyticsEvent(ANALYTICS_EVENT.SETTINGS.TOGGLE_FEATURE_FLAG, {
      name,
      value,
    });
  };

  return {
    features,
    updateFeature,
  };
}
