import {useDispatch, useSelector} from 'react-redux';
import {appOperations, appSelectors} from './app-slice';
import {translate} from '../../locales';

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
};

export const getAllFeatures = () =>
  Object.keys(Features).map(key => Features[key]);

export const defaultFeatures = {
  [Features.showTestnetTransaction.id]: false,
  [Features.credentials.id]: false,
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
  };

  return {
    features,
    updateFeature,
  };
}
