import {utilCryptoService} from '@docknetwork/wallet-sdk-core/lib/services/util-crypto';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {Credentials} from '@docknetwork/wallet-sdk-credentials/lib';
import {showToast} from '../../core/toast';
import {translate} from '../../locales';
import {getJsonOrError} from '../../core';
import '../credentials/credentials';
import {onScanAuthQRCode} from '../credentials/credentials';
import {captureException} from '@sentry/react-native';

export async function addressHandler(data) {
  const isAddress = await utilCryptoService.isAddressValid(data);

  if (isAddress) {
    navigate(Routes.TOKEN_SEND, {
      address: data,
    });
    return true;
  }

  console.log('not an address', data);
  return false;
}

export async function credentialHandler(data) {
  const isUrl = typeof data === 'string' && data.indexOf('http') === 0;

  try {
    // @ts-ignore
    const credentials: Credentials = Credentials.getInstance();

    let credentialData;
    if (isUrl) {
      showToast({
        type: 'message',
        message: translate('global.fetching_data'),
      });
      credentialData = await credentials.getCredentialFromUrl(data);
    } else {
      credentialData = JSON.parse(data);
    }

    const items = await credentials.query({});

    if (
      credentialData.id &&
      items.find(item => item.content && item.content.id === credentialData.id)
    ) {
      showToast({
        message: translate('credentials.existing_credential'),
        type: 'error',
      });

      return true;
    }

    await credentials.add(credentialData);

    navigate(Routes.APP_CREDENTIALS);
    return true;
  } catch (err) {
    console.error(err);

    if (isUrl) {
      console.error(`Unable to resolve url: ${data}`);
    } else {
      const jsonOrError = getJsonOrError(data);

      if (typeof jsonOrError === 'string') {
        console.error(`Unable to resolve json: ${jsonOrError}`);
      } else {
        console.error(jsonOrError);
      }
    }

    console.error(err);
    return false;
  }
}
export function onAuthQRScanned(data) {
  const isAuthLink = isDidAuthUrl(data);
  if (isAuthLink) {
    navigate(Routes.APP_DID_AUTH, {
      dockWalletAuthDeepLink: data,
    });
    return true;
  }
  return false;
}
export async function authHandler(data, keyDoc, profile = {}) {
  try {
    const authLinkPrefix = 'dockwallet://didauth?url=';
    const isAuthLink = isDidAuthUrl(data);
    if (isAuthLink) {
      showToast({
        type: 'message',
        message: translate('auth.auth_sign_in'),
      });
      const url = decodeURIComponent(data.substr(authLinkPrefix.length));

      const vc = await onScanAuthQRCode(url, keyDoc, profile);
      const req = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          vc,
        }),
      });
      const result = await req.json();
      if (result.verified) {
        showToast({
          type: 'message',
          message: translate('auth.auth_sign_in_success'),
        });
        return true;
      } else {
        showToast({
          type: 'error',
          message: result.error || translate('auth.auth_sign_in_failed'),
        });
        captureException(result);
        return false;
      }
    }
    return false;
  } catch (e) {
    showToast({
      type: 'error',
      message: `Sign in error: ${e.message}`,
    });
    captureException(e);
    return false;
  }
}

export const qrCodeHandlers = [
  onAuthQRScanned,
  addressHandler,
  credentialHandler,
];

export async function executeHandlers(data, handlers) {
  if (!data || !handlers) {
    return false;
  }

  for (const handler of handlers) {
    if (await handler(data)) {
      return true;
    }
  }

  return false;
}

export async function qrCodeHandler(data, handlers = qrCodeHandlers) {
  const success = await executeHandlers(data, handlers);

  if (!success) {
    showToast({
      type: 'error',
      message: translate('qr_scanner.not_supported_data'),
    });
  }
}

export function isDidAuthUrl(url) {
  const authLinkPrefix = 'dockwallet://didauth?url=';
  return typeof url === 'string' && url.indexOf(authLinkPrefix) === 0;
}
