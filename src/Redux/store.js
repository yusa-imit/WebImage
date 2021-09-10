import {createStore, applyMiddleware} from 'redux';
import {persistStore} from 'redux-persist';
import persistedReducer from './config.js'

const middlewares = [/*logger*/];
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);