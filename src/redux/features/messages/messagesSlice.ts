import { createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/app/store";
import { createSlice } from "@reduxjs/toolkit/react";
import { fetchUserList } from "@/api/users";

export interface MessagesSlice {
  messages: any[];
  metadata: any;
  loadingPrevMessages: boolean;
}

const initialState: MessagesSlice = {
  messages: [],
  metadata: null,
  loadingPrevMessages: false,
};

export const fetchPaginatedMessages = createAsyncThunk(
  `/users/fetchUserList`,
  async (pageNumber: number) => {
    const response = await fetchUserList(pageNumber);
    return response.data;
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    storeMessages: (state, action: PayloadAction<any[]>) => {
      state.messages = action.payload;
    },
    storeMoreMessages: (state, action: PayloadAction<any>) => {
      state.messages.push(...action.payload);
    },
    storeMetaData: (state, action: PayloadAction<any>) => {
      state.metadata = action.payload;
    },
    addNewMessage: (state, action: PayloadAction<any>) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPaginatedMessages.pending, (state) => {
      state.loadingPrevMessages = true;
    });
    // builder.addCase(fetchPaginatedMessages.fulfilled, (state, action) => {
    //   state.loadingPrevMessages = false;
    //   state.messages.push(...action.payload?.data);
    //   state.metadata = action.payload?.meta;
    // });
  },
});

export const {
  storeMessages,
  storeMoreMessages,
  storeMetaData,
  addNewMessage,
} = messagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages.messages;
export const selectMetaData = (state: RootState) => state.messages.metadata;
export const selectLoading = (state: RootState) =>
  state.messages.loadingPrevMessages;
export default messagesSlice.reducer;
