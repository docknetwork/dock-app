import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import logger from 'redux-logger';
import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './root-reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['did', 'credential', 'wallets', 'walletConnect'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, logger],
});

persistStore(store);

export default store;
