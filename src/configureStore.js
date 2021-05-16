import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import userReducers from './reducers/userReducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, combineReducers({ userReducers }));

export default () => {
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);
  return { store, persistor };
};
