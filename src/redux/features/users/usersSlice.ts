import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface UsersSlice {
  users: any[];
  userSelected: any;
}

const initialState: UsersSlice = {
  users: [],
  userSelected: undefined,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    userList: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    storeSelectedUser: (state, action: PayloadAction<any>) => {
      state.userSelected = action.payload;
    },
  },
});

export const { userList, storeSelectedUser } = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export const selectSelectedUser = (state: RootState) =>
  state.users.userSelected;

export default usersSlice.reducer;
