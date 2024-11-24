import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import logger from "redux-logger";
import storage from "redux-persist/lib/storage";

import messagesReducer from "../features/messages/messagesSlice";
import usersReducer from "../features/users/usersSlice";
import userReducer from "../features/user/userSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  user: userReducer,
  users: usersReducer,
  messages: messagesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
