import {createSlice} from '@reduxjs/toolkit';
// import WalletConnect from '@walletconnect/client';
import {navigate, navigateBack} from '../../core/navigation';
import {credIssuanceActions} from '../credential-issuance/cred-issuance-slice';
import {Routes} from '../../core/routes';
import {
  credentialActions,
  credentialOperations,
} from '../credentials/credential-slice';
import { Toast } from 'native-base';

const initialState = {
  loading: true,
  pendingUri: null,
  unlocked: false,
  sessions: [],
  request: null,
};

const connectors = {};

const walletConnect = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    addSession(state, action) {
      state.sessions.push(action.payload);
    },
    setRequest(state, action) {
      state.request = action.payload;
    },
    removeSession(state, action) {
      state.sessions = state.sessions.filter(s => s.id === action.payload.id);
    },
    setConnector(state, action) {
      const connector = action.payload;
      connectors[connector.key] = connector;
      state.connector = connector.key;
    },
    setConfirmConnection(state, action) {
      state.confirmConnection = action.payload;
    },
    setConfirmTransaction(state, action) {
      state.confirmTransaction = action.payload;
    },
  },
});

export const walletConnectActions = walletConnect.actions;

const getRoot = state => state.walletConnect;

export const walletConnectSelectors = {
  getLoading: state => getRoot(state).loading,
  getConnector: state => connectors[getRoot(state).connector],
  getConfirmConnection: state => getRoot(state).confirmConnection,
  getConfirmTransaction: state => getRoot(state).confirmTransaction,
  getSessions: state => getRoot(state).sessions,
  getRequest: state => getRoot(state).request,
};

export const walletConnectOperations = {
  handleSession: ({uri, session}) => async (dispatch, getState) => {
    console.log('handle wallet connect session', {uri, session});
    const connector = new WalletConnect({
      uri,
      session,
    });

    connector.uri = uri;

    connector.on('session_request', (error, payload) => {
      console.log('session_request', payload);

      dispatch(walletConnectActions.setConnector(connector));
      dispatch(walletConnectActions.setConfirmConnection(payload.params[0]));
    });

    connector.on('call_request', async (error, payload) => {
      console.log('call_request', payload);

      if (payload.method === 'credential_manifest') {
        dispatch(credIssuanceActions.setManifest(payload.params[0]));
        dispatch(credIssuanceActions.setLoading(false));

        navigate(Routes.APP_CREDENTIAL_ISSUANCE);
        return;
      }

      if (payload.method === 'credential_issued') {
        dispatch(credentialOperations.addCredential(payload.params[0]));
        
        Toast.show({
          text: "You have received a new credential",
          buttonText: "Okay",
          duration: 3000
        })
        
        navigate(Routes.APP_CREDENTIAL);
      }

      if (payload.method === 'presentation_request') {
        // dispatch(credentialOperations.addCredential(payload.params[0]));
        dispatch(walletConnectActions.setRequest(payload));
        navigate(Routes.APP_PRESENTATION_EXCHANGE);
      }
    });

    connector.on('disconnect', (error, payload) => {
      console.log('disconnect', payload);
    });

    try {
      await connector.createSession();
      console.log('Wallet connect session created.');
    } catch (err) {
      // TODO: Remove expired sesison
      console.error(err);
    }

    dispatch(walletConnectActions.setConnector(connector));
  },
  confirmConnection: hasConfirmed => async (dispatch, getState) => {
    if (!hasConfirmed) {
      dispatch(walletConnectActions.setConfirmConnection(null));
      return;
    }

    const state = getState();

    const connector = walletConnectSelectors.getConnector(state);
    const confirmConnection = walletConnectSelectors.getConfirmConnection(
      state,
    );
    const address = '0xA7Db77E19A7D0eDDa1ddbD867659D42f9027FeFE';

    if (connector) {
      connector.approveSession({
        accounts: [address],
        chainId: confirmConnection.chainId,
      });

      dispatch(walletConnectActions.addSession(connector.session));
    }

    dispatch(walletConnectActions.setConfirmConnection(null));
  },
  clearSessions: () => async (dispatch, getState) => {
    const state = getState();
    const sessions = walletConnectSelectors.getSessions(state);
    sessions.forEach(session => {
      const connector = connectors[session.key];

      if (connector) {
        connector.killSession();
        delete connectors[session.key];
      }
    });

    dispatch(walletConnectActions.setSessions([]));
  },
  initialize: () => async (dispatch, getState) => {
    const sessions = walletConnectSelectors.getSessions(getState());

    sessions.forEach(session => {
      dispatch(walletConnectOperations.handleSession({session}));
    });

    // dispatch(clearSessions());
  },
  sendMessage: message => (dispatch, getState) => {
    const connector = walletConnectSelectors.getConnector(getState());

    console.log('Send wallet connect message', message);

    if (!connector) {
      throw new Error('Connector not found');
    }

    connector.sendCustomRequest(message);
  },
};

export const isWalletConnectUri = data => data.indexOf('wc:') === 0;

export const walletConnectReducer = walletConnect.reducer;
