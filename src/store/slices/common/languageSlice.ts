import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";
import { AppLanguage, getSystemLanguage, normalizeLanguage } from "config/languages";

type LanguageState = {
  currentLanguage: AppLanguage;
};

const storedLanguage = getCookie("language");
const initialLanguage = storedLanguage
  ? normalizeLanguage(storedLanguage)
  : getSystemLanguage();

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: initialLanguage,
  } as LanguageState,
  reducers: {
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.currentLanguage = action.payload;
      setCookie("language", action.payload, 365);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
