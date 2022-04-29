import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';
import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './root-reducer';

const {NODE_ENV} = process.env;

let store;
const middleware = [thunk];

if (NODE_ENV === 'development') {
  // middleware.push(logger);
}

if (NODE_ENV === 'test') {
  store = configureStore({
    reducer: rootReducer,
    middleware,
  });
} else {
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['did', 'credential', 'wallets', 'walletConnect', 'app'],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  store = configureStore({
    reducer: persistedReducer,
    middleware,
  });

  persistStore(store);
}

export default store;
