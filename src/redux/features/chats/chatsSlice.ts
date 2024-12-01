import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ChatsSlice {
  chats: any[];
  selectedChat: any;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
}

const initialState: ChatsSlice = {
  chats: [],
  selectedChat: undefined,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    storeChats: (state, action: PayloadAction<any[]>) => {
      state.chats = action.payload;
    },
    storeSelectedChat: (
      state,
      action: PayloadAction<{ chat: any; currentUser: any; user: any }>
    ) => {
      const { chat, currentUser, user } = action.payload;
      state.selectedChat = chat;

      state.isCurrentUserBlocked = user?.blocked?.includes(currentUser?.id);

      state.isReceiverBlocked = currentUser?.blocked.includes(user?.id);
    },
    toggleBlockUser: (state) => {
      state.isReceiverBlocked = !state.isReceiverBlocked;
    },
  },
});

export const { storeChats, storeSelectedChat, toggleBlockUser } =
  chatsSlice.actions;

export const selectUsers = (state: RootState) => state.chats.chats;
export const selectSelectedChat = (state: RootState) =>
  state.chats.selectedChat;
export const selectIsCurrentUserBlocked = (state: RootState) =>
  state.chats.isCurrentUserBlocked;
export const selectIsReceiverBlocked = (state: RootState) =>
  state.chats.isReceiverBlocked;

export default chatsSlice.reducer;
