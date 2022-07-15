import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import {didServiceRPC} from '@docknetwork/wallet-sdk-core/lib/services/dids';
import {captureException} from '@sentry/react-native';
import {translate} from '../../locales';

const wallet = Wallet.getInstance();

const createKeyDoc = ({type, derivePath}) => {
  return didServiceRPC.generateKeyDoc({type, derivePath});
};
const createKeyDID = async (keyDoc, didDocumentCustomProp = {}) => {
  try {
    const correlations = Array.isArray(keyDoc.correlation)
      ? keyDoc.correlation
      : [];

    const {didDocument} = await didServiceRPC.keypairToDIDKeyDocument({
      keypairDoc: keyDoc,
    });

    const didDocumentResolution = await didServiceRPC.getDIDResolution({
      didDocumentCustomProp,
      didDocument,
    });

    didDocumentResolution.correlation.push(keyDoc.id);

    correlations.push(didDocumentResolution.id);
    await wallet.add({
      ...didDocumentResolution,
    });
    await wallet.update({
      ...keyDoc,
      correlation: correlations,
    });
  } catch (e) {
    captureException(e);
  }
};

export const createDefaultDID = async () => {
  const keyDocs = await wallet.query({
    type: 'Ed25519VerificationKey2018',
  });

  if (keyDocs.length > 0) {
    const didResolutionDocuments = await wallet.query({
      type: 'DIDResolutionResponse',
    });

    if (didResolutionDocuments.length === 0) {
      await createKeyDID(keyDocs[0], {
        name: translate('didManagement.default'),
      });
    }
  } else if (keyDocs.length === 0) {
    try {
      const keyDoc = await createKeyDoc({
        type: 'ed25519',
        derivePath: '',
      });
      await wallet.add({
        ...keyDoc,
      });

      await createDefaultDID();
    } catch (e) {
      captureException(e);
    }
  }
};
const createDockDID = () => {};
export const createNewDID = async newDidParams => {
  const didFactories = {
    diddock: createDockDID,
    didkey: async () => {
      const keyDoc = await createKeyDoc(newDidParams);
      await wallet.add({
        ...keyDoc,
      });
      await createKeyDID(keyDoc, newDidParams);
    },
  };
  didFactories[newDidParams.didType]();
};

export const updateDIDDocument = async (documentId, updatedDoc) => {
  const docs = await wallet.query({
    id: documentId,
  });
  if (docs.length === 1) {
    const doc = docs[0];
    await wallet.update({
      ...doc,
      ...updatedDoc,
    });
  }
};
export const deleteDIDDocument = async documentId => {
  await wallet.remove(documentId);
};
export const didOperations = {
  initializeDID: () => async (dispatch, getState) => {
    await createDefaultDID();
  },
};
