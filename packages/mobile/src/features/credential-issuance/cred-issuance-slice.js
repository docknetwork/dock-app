import {createSlice} from '@reduxjs/toolkit';
import {DockRpc} from '../../rn-rpc-webview/dock-rpc';
import schemaMock from './schema-mock.json';
import manifestMock from './manifest-mock.json';
import {walletConnectOperations} from '../wallet-connect/wallet-connect-slice';
import { navigate } from '../../core/navigation';
import { Routes } from '../../core/routes';

const initialState = {
  loading: true,
  schema: null,
  manifest: null,
};

const credIssuance = createSlice({
  name: 'credIssuance',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setManifest(state, action) {
      state.manifest = action.payload;
    },
    setSchema(state, action) {
      state.schema = action.payload;
    },
  },
});

export const credIssuanceActions = credIssuance.actions;

const getRoot = state => state.credIssuance;

export const credIssuanceSelectors = {
  getLoading: state => getRoot(state).loading,
  getManifest: state => getRoot(state).manifest,
  getSchema: state => getRoot(state).schema,
};

export const credIssuanceOperations = {
  /**
   * Fetch CREDENTIALs for the current wallet
   *
   * @returns
   */
  example: () => async (dispatch, getState) => {
    navigate(Routes.APP_CREDENTIAL_ISSUANCE);
    dispatch(credIssuanceActions.setLoading(true));
    dispatch(credIssuanceActions.setManifest(manifestMock));
    dispatch(credIssuanceActions.setSchema(schemaMock));
    dispatch(credIssuanceActions.setLoading(false));
  },

  submitCredential: form => async (dispatch, getState) => {
    dispatch(credIssuanceActions.setLoading(true));
    // get wallet connect instance and send message
    // fetch session for the issuer DID
    dispatch(
      walletConnectOperations.sendMessage({
        method: 'credential_manifest_response',
        params: [form],
      }),
    );

    dispatch(credIssuanceActions.setLoading(false));
    navigate(Routes.APP_HOME);
  },
};

export const credIssuanceReducer = credIssuance.reducer;
