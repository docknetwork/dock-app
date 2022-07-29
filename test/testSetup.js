import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import {NativeModules} from 'react-native';
import mockAsyncStorage from '../node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockRNPermissions from '../node_modules/react-native-permissions/mock';
import '../src/core/setup-env';
import {DebugConstants} from '../src/features/constants';

jest.mock('@docknetwork/wallet-sdk-core/lib/core/realm', () => {
  const realmFunctions = {
    write: jest.fn(callback => {
      callback();
    }),
    create: jest.fn(),
    delete: jest.fn(),
    objects: jest.fn(() => ({
      filtered: jest.fn(),
    })),
  };
  return {
    getRealm: () => realmFunctions,
    addSchema: jest.fn(),
  };
});
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-device-info', () => 'DeviceInfo');
jest.mock('react-native-permissions', () => mockRNPermissions);

jest.mock('react-native-share', () => {
  const open = jest.fn(() => Promise.resolve([]));
  return {
    __esModule: true,
    default: {
      open,
    },
  };
  // return {
  //   open: jest.fn(),
  // };
});

Enzyme.configure({adapter: new Adapter()});

React.useLayoutEffect = React.useEffect;

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({children}) => children;
  return {KeyboardAwareScrollView};
});

jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: jest.fn(),
  DocumentDirectoryPath: 'DocumentDirectoryPath',
  ExternalDirectoryPath: jest.fn(),
  ExternalStorageDirectoryPath: jest.fn(),
  LibraryDirectoryPath: jest.fn(),
  MainBundlePath: 'testPath',
  PicturesDirectoryPath: jest.fn(),
  TemporaryDirectoryPath: jest.fn(),
  appendFile: jest.fn(),
  completeHandlerIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  copyFile: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  downloadFile: jest.fn(),
  exists: jest.fn(),
  existsAssets: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  getFSInfo: jest.fn(),
  hash: jest.fn(),
  isResumable: jest.fn(),
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  read: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  readFile: () =>
    new Promise(resolve => {
      resolve('console.log()');
    }),
  readFileAssets: jest.fn(),
  readdir: jest.fn(),
  resumeDownload: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  stopDownload: jest.fn(),
  stopUpload: jest.fn(),
  touch: jest.fn(),
  unlink: jest.fn(),
  uploadFiles: jest.fn(),
  write: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: () => Promise.resolve('FaceId'),
  BIOMETRY_TYPE: {
    FACE_ID: 1,
    FINGERPRINT: 2,
  },
}));

NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};

NativeModules.RNCNetInfo = {
  getCurrentConnectivity: jest.fn(),
  isConnectionMetered: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
  getCurrentState: jest.fn(() => Promise.resolve()),
};

NativeModules.RCTAnalytics = {
  optIn: jest.fn(),
  trackEvent: jest.fn(),
  getRemoteVariables: jest.fn(),
};

jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableOpacity',
  () => 'TouchableOpacity',
);
jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableHighlight',
  () => 'TouchableHighlight',
);
jest.mock(
  'react-native/Libraries/Components/TextInput/TextInput',
  () => 'TextInput',
);
jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {},
}));

jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  runAfterInteractions: jest.fn(),
  createInteractionHandle: jest.fn(),
  clearInteractionHandle: jest.fn(),
  setDeadline: jest.fn(),
}));

jest.mock('@react-native-firebase/analytics', () => {
  const logEvent = jest.fn(() => Promise.resolve([]));
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      logEvent,
    }),
  };
});

jest.mock('react-native-screen-capture-secure', () => {
  const originalModule = jest.requireActual(
    'react-native-screen-capture-secure',
  );
  const enableSecure = jest.fn();
  const disableSecure = jest.fn();
  return {
    __esModule: true,
    default: {
      enableSecure,
      disableSecure,
    },
  };
});

jest.mock('@docknetwork/react-native-sdk/src/client/wallet-rpc', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/react-native-sdk/src/client/wallet-rpc',
  );
  const {WalletRpc} = originalModule;
  return {
    __esModule: true,
    WalletRpc: {
      ...WalletRpc,
      importWallet: jest.fn(() => Promise.resolve()),
      query: jest.fn(() => Promise.resolve([])),
      remove: jest.fn(),
      create: jest.fn(),
      load: jest.fn(),
      sync: jest.fn(),
    },
  };
});
jest.mock('@docknetwork/wallet-sdk-core/lib/services/substrate', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/services/substrate',
  );
  const {substrateService} = originalModule;
  return {
    __esModule: true,
    substrateService: {
      ...substrateService,
      sendTokens: jest.fn(() => Promise.resolve()),
    },
  };
});

jest.mock('@docknetwork/wallet-sdk-core/lib/modules/wallet', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/modules/wallet',
  );
  let docs = [];
  const mockFunctions = {
    getInstance: jest.fn().mockReturnValue({
      query: jest.fn(q => {
        if (q) {
          return docs.filter(singleDocument => {
            for (const key in q) {
              if (q[key] !== singleDocument[key]) {
                return false;
              }
            }
            return true;
          });
        }
        return docs;
      }),
      add: jest.fn(doc => {
        docs.push(doc);
      }),
      update: jest.fn(doc => {
        docs.forEach((singleDocument, index) => {
          if (doc.id === singleDocument.id) {
            docs[index] = doc;
          }
        });
      }),
      remove: jest.fn(documentId => {
        docs = docs.filter(doc => {
          return doc.id !== documentId;
        });
      }),
      accounts: {
        fetchBalance: jest.fn(() => Promise.resolve(0)),
      },
    }),
  };

  return {
    ...originalModule,
    Wallet: mockFunctions,
  };
});

jest.mock('@docknetwork/wallet-sdk-core/lib/services/dids', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/services/dids',
  );
  const mockFunctions = {
    generateKeyDoc: jest.fn().mockReturnValue({
      '@context': ['https://w3id.org/wallet/v1'],
      id: 'urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002',
      name: 'My Test Key 2',
      image: 'https://via.placeholder.com/150',
      description: 'For testing only, totally compromised.',
      tags: ['professional', 'organization', 'compromised'],
      correlation: [],
      controller: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      type: 'Ed25519VerificationKey2018',
      privateKeyBase58:
        '3CQCBKF3Mf1tU5q1FLpHpbxYrNYxLiZk4adDtfyPEfc39Wk6gsTb2qoc1ZtpqzJYdM1rG4gpaD3ZVKdkiDrkLF1p',
      publicKeyBase58: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
    }),
    keypairToDIDKeyDocument: jest.fn().mockReturnValue({
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://ns.did.ai/transmute/v1',
          {
            '@base': 'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
          },
        ],
        id: 'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
        verificationMethod: [
          {
            id: '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
            type: 'JsonWebKey2020',
            controller:
              'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
            publicKeyJwk: {
              crv: 'Ed25519',
              x: 'vGur-MEOrN6GDLf4TBGHDYAERxkmWOjTbztvG3xP0I8',
              kty: 'OKP',
            },
          },
          {
            id: '#z6LScrLMVd9jvbphPeQkGffSeB99EWSYqAnMg8rGiHCgz5ha',
            type: 'JsonWebKey2020',
            controller:
              'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
            publicKeyJwk: {
              kty: 'OKP',
              crv: 'X25519',
              x: 'EXXinkMxdA4zGmwpOOpbCXt6Ts6CwyXyEKI3jfHkS3k',
            },
          },
        ],
        authentication: ['#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg'],
        assertionMethod: ['#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg'],
        capabilityInvocation: [
          '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
        ],
        capabilityDelegation: [
          '#z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
        ],
        keyAgreement: ['#z6LScrLMVd9jvbphPeQkGffSeB99EWSYqAnMg8rGiHCgz5ha'],
      },
    }),
    getDIDResolution: jest.fn(({didDocument}) => {
      return {
        id: new Date().getTime().toString(),
        type: 'DIDResolutionResponse',
        didDocument,
        correlation: [],
      };
    }),
  };

  return {
    ...originalModule,
    didServiceRPC: mockFunctions,
  };
});

jest.mock('@docknetwork/wallet-sdk-core/lib/services/credential', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/services/credential',
  );
  const mockFunctions = {
    generateCredential: jest.fn().mockResolvedValue({
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: [],
      issuanceDate: '2022-06-01T12:32:13.106Z',
    }),
    signCredential: jest.fn().mockResolvedValue(DebugConstants.authCredential),
  };

  return {
    ...originalModule,
    credentialServiceRPC: mockFunctions,
  };
});

jest.mock('@docknetwork/wallet-sdk-core/lib/services/wallet', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/services/wallet',
  );
  const mockFunctions = {
    resolveCorrelations: jest.fn(() => {
      return [
        {
          '@context': ['https://w3id.org/wallet/v1'],
          id: 'urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002',
          name: 'My Test Key 2',
          image: 'https://via.placeholder.com/150',
          description: 'For testing only, totally compromised.',
          tags: ['professional', 'organization', 'compromised'],
          correlation: ['1654905466848'],
          controller:
            'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
          type: 'Ed25519VerificationKey2018',
          privateKeyBase58:
            '3CQCBKF3Mf1tU5q1FLpHpbxYrNYxLiZk4adDtfyPEfc39Wk6gsTb2qoc1ZtpqzJYdM1rG4gpaD3ZVKdkiDrkLF1p',
          publicKeyBase58: '6GwnHZARcEkJio9dxPYy6SC5sAL6PxpZAB6VYwoFjGMU',
        },
        {
          id: '1654905466848',
          type: 'DIDResolutionResponse',
          didDocument: {
            '@context': [Array],
            id: 'did:key:z6Mks8mvCnVx4HQcoq7ZwvpTbMnoRGudHSiEpXhMf6VW8XMg',
            verificationMethod: [Array],
            authentication: [Array],
            assertionMethod: [Array],
            capabilityInvocation: [Array],
            capabilityDelegation: [Array],
            keyAgreement: [Array],
          },
          correlation: ['urn:uuid:e8fc7810-9524-11ea-bb37-0242ac130002'],
        },
      ];
    }),
  };

  return {
    ...originalModule,
    walletService: mockFunctions,
  };
});

jest.mock('@docknetwork/wallet-sdk-core/lib/services/keyring', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-core/lib/services/keyring',
  );
  const mockFunctions = {
    addFromJson: jest.fn(() => {}),
  };

  return {
    ...originalModule,
    keyringService: mockFunctions,
  };
});
jest.mock('@docknetwork/wallet-sdk-react-native/lib', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-react-native/lib',
  );

  const mockFunctions = {
    createKeyDID: jest.fn(didParams => {
      const {type = 'ed25519'} = didParams;
      if (type === 'ed25519') {
        return Promise.resolve();
      }
      return Promise.reject();
    }),
    deleteDID: jest.fn(() => {}),
    editDID: jest.fn(didParams => {
      const {id} = didParams;
      if (typeof id === 'string' && id.length > 0) {
        return Promise.resolve();
      }
      return Promise.reject();
    }),
    didList: [],
  };
  return {
    WalletSDKProvider: originalModule.WalletSDKProvider,
    useDIDManagement: () => mockFunctions,
  };
});
jest.mock('@docknetwork/wallet-sdk-react-native/lib', () => {
  const originalModule = jest.requireActual(
    '@docknetwork/wallet-sdk-react-native/lib',
  );

  const mockFunctions = {
    importDID: jest.fn(({password}) => {
      if (password === 'test') {
        return Promise.resolve([]);
      }
      return Promise.reject('Incorrect password');
    }),
    createKeyDID: jest.fn(didParams => {
      const {type = 'ed25519'} = didParams;
      if (type === 'ed25519') {
        return Promise.resolve();
      }
      return Promise.reject('Only ed25519 keypair is supported.');
    }),
    deleteDID: jest.fn(() => {}),
    editDID: jest.fn(didParams => {
      const {id} = didParams;
      if (typeof id === 'string' && id.length > 0) {
        return Promise.resolve();
      }
      return Promise.reject('Document ID is not set');
    }),
    exportDID: jest.fn(({id, password}) => {
      if (id) {
        return Promise.resolve({});
      }
      return Promise.reject('DID Document not found');
    }),
    didList: [],
  };
  return {
    WalletSDKProvider: originalModule.WalletSDKProvider,
    useDIDManagement: () => mockFunctions,
  };
});
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({test: 100}),
  }),
);
