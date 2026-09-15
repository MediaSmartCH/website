import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";
import {
  AppLanguage,
  getLanguageFromPath,
  getSystemLanguage,
  normalizeLanguage,
} from "config/languages";

type LanguageState = {
  currentLanguage: AppLanguage;
};

/**
 * The language the app should start in.
 *
 * The URL prefix wins because LangLayout enforces it on mount anyway; seeding
 * from it means the first paint is already in the language that will be shown,
 * and the bootstrap only has to load that one dictionary.
 */
export const resolveInitialLanguage = (): AppLanguage => {
  const fromPath =
    typeof window !== "undefined"
      ? getLanguageFromPath(window.location.pathname)
      : null;

  if (fromPath) {
    return fromPath;
  }

  const storedLanguage = getCookie("language");

  return storedLanguage ? normalizeLanguage(storedLanguage) : getSystemLanguage();
};

const initialLanguage = resolveInitialLanguage();

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
