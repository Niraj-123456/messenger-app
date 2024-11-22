import { RootState } from "@/redux/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    signOut: (state) => {
      state.user = null;
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
