import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {pickJSONFile} from '../../core/storage-utils';
import {showToast} from 'src/core/toast';
import {translate} from 'src/locales';
import assert from 'assert';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

export const sortByIssuanceDate = (a, b) =>
  getCredentialTimestamp(b.content) - getCredentialTimestamp(a.content);

export function getCredentialTimestamp(credential) {
  assert(!!credential, 'credential is required');

  if (!credential.issuanceDate) {
    return 0;
  }

  return new Date(credential.issuanceDate).getTime() || 0;
}

export function getObjectFields(credential) {
  assert(!!credential, 'credential is required');

  const subject = credential.credentialSubject || {};
  const objectAttributes = [];

  Object.keys(subject).forEach(key => {
    const data = subject[key];

    if (typeof data === 'object') {
      objectAttributes.push(key);
    }
  });

  return objectAttributes;
}

// TODO: Investigate why WalletRpc is not working properly for this calls
// This proxy should not be required and must be handled by the wallet sdk
Credentials.getInstance().wallet = {
  add: async doc => {
    const result = {
      '@context': ['https://w3id.org/wallet/v1'],
      id: `credential-${Date.now()}`,
      ...doc,
    };

    await WalletRpc.add(result);

    return result;
  },
  query: params =>
    WalletRpc.query({
      equals: {
        'content.type': params.type,
      },
    }),
  remove: params => WalletRpc.remove(params),
};

export function getDIDAddress(did) {
  assert(!!did, 'did is required');

  return did.replace(/did:\w+:/gi, '');
}

export function useCredentials({onPickFile = pickJSONFile} = {}) {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
    const credentials = await Credentials.getInstance().query();
    setItems(credentials.sort(sortByIssuanceDate));
  };

  useEffect(() => {
    syncCredentials();
  }, []);

  const handleRemove = async item => {
    await Credentials.getInstance().remove(item.id);
    await syncCredentials();
  };

  const onAdd = async () => {
    const jsonData = await onPickFile();

    if (!jsonData) {
      return;
    }

    try {
      await Credentials.getInstance().add(jsonData);
      await syncCredentials();
      logAnalyticsEvent(ANALYTICS_EVENT.CREDENTIALS.IMPORT);
    } catch (err) {
      showToast({
        message: translate('credentials.invalid_credential'),
        type: 'error',
      });
      logAnalyticsEvent(ANALYTICS_EVENT.FAILURES, {
        name: ANALYTICS_EVENT.CREDENTIALS.IMPORT,
      });
    }
  };

  return {
    credentials: items,
    handleRemove,
    onAdd,
  };
}
