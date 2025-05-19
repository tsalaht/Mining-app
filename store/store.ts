import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';
import cartReducer from './cartSlice';
import userReducer from "./userSlice";
import passHomeReducer from './PassHomeSlice';
import searchReducer from "./searchSlice";
import coinReducer from './coinSlice';
import miningReducer from './miningSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    cart: cartReducer,
    user: userReducer,
    passHome: passHomeReducer,
    search: searchReducer,
    coin: coinReducer,
    mining: miningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
