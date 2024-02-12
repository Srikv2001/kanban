import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// slices
import authReducer from "../redux/slices/authSlice";
import kanbanReducer from '../redux/slices/kanbanSlice';

// ----------------------------------------------------------------------

const authPersistConfig = {
  key: "auth",
  storage,
  keyPrefix: "redux-",
  whitelist: ["isAuthenticated", "userDetails"],
  blacklist: ["isLoading"],
};

const kanbanPersistConfig = {
  key: "kanban",
  storage,
  keyPrefix: "redux-",
  whitelist: ["addTask", "moveTask"],
  blacklist: ["isLoading"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  kanban: persistReducer(kanbanPersistConfig, kanbanReducer)
});

const persistedReducer = persistReducer(
  { key: 'root', storage },
  rootReducer
);

const reducers = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    const store = persistStore();
    store.purge(); // This will clear the entire persisted state
    return persistedReducer(undefined, action);
  }
  return persistedReducer(state, action);
};

export { rootReducer, reducers };