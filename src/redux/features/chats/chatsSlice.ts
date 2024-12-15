import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ChatsSlice {
  chats: any[];
  blocked: string[];
  selectedChat: any;
}

const initialState: ChatsSlice = {
  chats: [],
  blocked: [],
  selectedChat: undefined,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    storeChats: (state, action: PayloadAction<any[]>) => {
      state.chats = action.payload;
    },
    storeSelectedChat: (state, action: PayloadAction<any>) => {
      state.selectedChat = action.payload;
    },
    storeBlocked: (state, action: PayloadAction<string[]>) => {
      state.blocked = action.payload;
    },

    toggleBlockUser: (state, action: PayloadAction<string>) => {
      const userIdx = state.blocked.indexOf(action.payload);
      if (userIdx <= -1) state.blocked.push(action.payload);
      else state.blocked.splice(userIdx, 1);
    },
  },
});

export const { storeChats, storeSelectedChat, storeBlocked, toggleBlockUser } =
  chatsSlice.actions;

export const selectUsers = (state: RootState) => state.chats.chats;
export const selectSelectedChat = (state: RootState) =>
  state.chats.selectedChat;
export const selectBlocked = (state: RootState) => state.chats.blocked;

export default chatsSlice.reducer;
