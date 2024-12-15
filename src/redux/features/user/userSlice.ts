import { RootState } from "@/redux/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSlice {
  user: {
    displayName: string;
    email: string;
    photoUrl: string;
    blocked: string[];
    id: string;
  } | null;
}

const initialState: UserSlice = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },

    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export const selectLoggedInUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
