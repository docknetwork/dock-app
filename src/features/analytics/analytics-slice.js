import analytics from '@react-native-firebase/analytics';
import {captureException} from '@sentry/react-native';

export function logAnalyticsEvent(eventName, params = {}) {
  if (typeof eventName === 'string' && eventName.length > 0) {
    analytics()
      .logEvent(eventName, params)
      .catch(err => {
        captureException(err);
      });
  }
}
export const ANALYTICS_EVENT = {
  TOKENS: {
    SEND_TOKEN: 'token_send',
    RECEIVE_TOKEN: 'token_receive',
    BUY_TOKEN: 'token_buy',
  },
  WALLET: {
    BACKUP: 'wallet_backup',
    IMPORT: 'wallet_import',
  },
  ACCOUNT: {
    BACKUP: 'account_backup',
    IMPORT: 'account_import',
    EXPORT: 'account_export',
  },
  CREDENTIALS: {
    IMPORT: 'credentials_import',
    PRESENT: 'credentials_present',
  },
  SETTINGS: {
    TOGGLE_FEATURE_FLAG: 'settings_toggle_feature_flag',
    SWITCH_NETWORK: 'settings_switch_network',
  },
  FAILURES: 'failure',
  DID: {
    DID_CREATED: 'didCreated',
    DID_UPDATED: 'didUpdated',
    DID_IMPORTED: 'didUpdated',
    DID_SHARED: 'didShared',
    DID_EXPORTED: 'didExported',
  },
};
