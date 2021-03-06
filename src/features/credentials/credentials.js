import {useEffect, useState} from 'react';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {getVCData} from '@docknetwork/prettyvc';
import {pickJSONFile} from '../../core/storage-utils';
import {showToast} from 'src/core/toast';
import {translate} from 'src/locales';
import assert from 'assert';
import {credentialServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/credential';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import queryString from 'query-string';
const wallet = Wallet.getInstance();
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import {captureException} from '@sentry/react-native';
import {walletService} from '@docknetwork/wallet-sdk-core/lib/services/wallet';

export const sortByIssuanceDate = (a, b) =>
  getCredentialTimestamp(b.content) - getCredentialTimestamp(a.content);

export function getCredentialTimestamp(credential) {
  assert(!!credential, 'credential is required');

  if (!credential.issuanceDate) {
    return 0;
  }

  return new Date(credential.issuanceDate).getTime() || 0;
}

// TODO: Investigate why WalletRpc is not working properly for this calls
// This proxy should not be required and must be handled by the wallet sdk
// Credentials.getInstance().wallet = {
//   add: async doc => {
//     const result = {
//       '@context': ['https://w3id.org/wallet/v1'],
//       id: `credential-${Date.now()}`,
//       ...doc,
//     };

//     await WalletRpc.add(result);

//     return result;
//   },
//   query: params =>
//     WalletRpc.query({
//       equals: {
//         'content.type': params.type,
//       },
//     }),
//   remove: params => WalletRpc.remove(params),
// };

export function getDIDAddress(did) {
  assert(!!did, 'did is required');

  return did.replace(/did:\w+:/gi, '');
}

export async function processCredential(credential) {
  assert(!!credential, 'Credential is required');
  assert(!!credential.content, 'credential.content is required');
  assert(
    !!credential.content.credentialSubject,
    'credential.content.credentialSubject is required',
  );

  if (credential.content.issuanceDate) {
    const issuanceDate = new Date(credential.content.issuanceDate);
    const userTimezoneOffset = issuanceDate.getTimezoneOffset() * 60000;
    credential.content.issuanceDate = new Date(
      issuanceDate.getTime() + userTimezoneOffset,
    );
  }

  const formattedData = await getVCData(credential.content, {
    generateImages: false,
    generateQRImage: false,
  });

  return {
    ...credential,
    formattedData,
  };
}

export function useCredentials({onPickFile = pickJSONFile} = {}) {
  const [items, setItems] = useState([]);

  const syncCredentials = async () => {
    const credentials = await Credentials.getInstance().query();

    const processedCredentials = await Promise.all(
      credentials.sort(sortByIssuanceDate).map(processCredential),
    );

    setItems(processedCredentials);
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
      if (items.find(item => item.content.id === item.id)) {
        showToast({
          message: translate('credentials.existing_credential'),
          type: 'error',
        });
        return;
      }
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
export function getParamsFromUrl(url, param) {
  const startOfQueryParams = url.indexOf('?');

  const parsed = queryString.parse(url.substring(startOfQueryParams));
  return parsed[param] ? parsed[param] : '';
}
export async function onScanAuthQRCode(url) {
  try {
    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });

    if (didResolutionDocuments.length > 0) {
      const correlationDocs = await walletService.resolveCorrelations(
        didResolutionDocuments[0].id,
      );
      const keyDoc = correlationDocs.find(
        document => document.type === 'Ed25519VerificationKey2018',
      );
      const subject = {
        state: getParamsFromUrl(url, 'id'),
      };
      const verifiableCredential =
        await credentialServiceRPC.generateCredential({
          subject,
        });
      if (keyDoc) {
        return credentialServiceRPC.signCredential({
          vcJson: verifiableCredential,
          keyDoc,
        });
      }
    }
    throw new Error(translate('qr_scanner.no_key_doc'));
  } catch (e) {
    captureException(e);
    throw new Error(e.message);
  }
}
