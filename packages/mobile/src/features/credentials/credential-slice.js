import {createSlice} from '@reduxjs/toolkit';
import {walletsSelectors} from '../wallets/wallets-slice';
import {didSelectors} from '../did/did-slice';
import { DockRpc } from '../../rn-rpc-webview/dock-rpc';

const initialState = {
  loading: true,
  items: [],
  registry: null,
};

const credential = createSlice({
  name: 'credential',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    setRegistry(state, action) {
      state.registry = action.payload;
    },
    addItem(state, action) {
      if (!state.items) {
        state.items = [];
      }

      state.items.push(action.payload);
    },
    removeItem(state, action) {
      const credentialDoc = action.payload;
      state.items = state.items.filter(item => item.id !== credentialDoc.id);
    },
  },
});

export const credentialActions = credential.actions;

const getRoot = state => state.credential;

export const credentialSelectors = {
  getLoading: state => getRoot(state).loading,
  getItems: state => getRoot(state).items,
  getRegistry: state => getRoot(state).registry,
};

// const resolver = new DockResolver(dock);

// hardcoded registry for testing
// const registryId =
//   '0x99bfe2629e7e62928b799a54ccfded19c9b88ed98f032569fffcef6ca82241b5';

export const credentialOperations = {
  /**
   * Fetch CREDENTIALs for the current wallet
   *
   * @returns
   */
  fetch: () => async (dispatch, getState) => {
    dispatch(credentialActions.setLoading(false));
    await dispatch(credentialOperations.loadRegistry());
  },

  loadRegistry: () => async (dispatch, getState) => {
    // const state = getState();
    // let registry = credentialSelectors.getRegistry(state);

    // if (!registry) {
    //   const issuerDID = didSelectors.getItems(state)[0].id;
    //   const policy = new OneOfPolicy();
    //   policy.addOwner(issuerDID);

    //   registry = await dock.revocation.newRegistry(
    //     registryId,
    //     policy,
    //     false,
    //     false,
    //   );

    //   dispatch(credentialActions.setRegistry(registry));
    // }
  },

  revokeCredential: credentialDoc => async (dispatch, getState) => {
    // const state = getState();
    // credentialDoc = {
    //   ...credentialDoc,
    // };

    // delete credentialDoc.walletId;

    // const expanded = await expandJSONLD(credentialDoc);
    // const revId = getDockRevIdFromCredential(expanded);

    // const didKeys = new KeyringPairDidKeys();
    // const pair = walletsSelectors.getCurrentWallet(state);
    // const issuerDID = didSelectors.getItems(state)[0].id;
    // didKeys.set(issuerDID, pair);

    // await dock.revocation.revokeCredential(didKeys, registryId, revId, false);

    // debugger;
  },
  verifyCredential: credentialDoc => async (dispatch, getState) => {
    credentialDoc = {
      ...credentialDoc,
    };

    delete credentialDoc.walletId;
    const result = await DockRpc.verifyCredential(credentialDoc);

    alert(`Verified: ${result.verified}`);
  },
  addCredential: (credentialDoc) => async (dispatch, getState) => {
    dispatch(credentialActions.setLoading(true));
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    // const did = didSelectors.getItems(state)[0].id;
    // const credentialDocument = await DockRpc.issueCredential(did);

    dispatch(
      credentialActions.addItem({
        ...credentialDoc,
        walletId: wallet.address,
      }),
    );
    dispatch(credentialActions.setLoading(false));
  },
  createCredential: () => async (dispatch, getState) => {
    dispatch(credentialActions.setLoading(true));
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    const did = didSelectors.getItems(state)[0].id;
    const credentialDocument = await DockRpc.issueCredential(did);

    dispatch(
      credentialActions.addItem({
        ...credentialDocument,
        walletId: wallet.address,
      }),
    );
    dispatch(credentialActions.setLoading(false));
  },
};

export const credentialReducer = credential.reducer;
