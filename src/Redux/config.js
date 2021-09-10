import createElectronStorage from "redux-persist-electron-storage";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import settings from "./settings.js";


const persistConfig = {
    key: 'root',
    storage: createElectronStorage(),
    stateReconciler:autoMergeLevel2,
    whitelist:["settings"]
  }
const rootReducer = combineReducers({
    settings:settings,
  })
export default persistReducer(persistConfig, rootReducer)
