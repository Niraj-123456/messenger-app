import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/user/usersSlice";
import logger from "redux-logger";
import messagesReducer from "../features/messages/messagesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
