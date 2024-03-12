import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";

const systemLanguage = navigator.language || (navigator as any).userLanguage;
const initialLanguage = getCookie('language') || (/^fr\b/.test(systemLanguage) ? 'fr' : 'en');

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: initialLanguage,
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      setCookie('language', action.payload, 365);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
