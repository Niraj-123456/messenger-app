import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ChatsSlice {
  chats: any[];
  selectedChat: any;
}

const initialState: ChatsSlice = {
  chats: [],
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
  },
});

export const { storeChats, storeSelectedChat } = chatsSlice.actions;

export const selectUsers = (state: RootState) => state.chats.chats;
export const selectSelectedChat = (state: RootState) =>
  state.chats.selectedChat;

export default chatsSlice.reducer;
