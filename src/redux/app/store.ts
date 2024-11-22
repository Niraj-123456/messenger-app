import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/usersSlice";
import logger from "redux-logger";
import messagesReducer from "../features/messages/messagesSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
