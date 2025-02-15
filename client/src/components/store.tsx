// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import ChatData from "./chatFiles/store/chatData.Store"
interface UserState {//slice init data define
  isAuthenticated: boolean;
  userInfo: {
    name: string;
    email: string;
    image: string;
  } | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; image: string }>) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;


//exporting stores
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    Chat: ChatData,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
