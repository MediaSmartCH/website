import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";
import {
  isThemePreference,
  resolveThemePreference,
  ThemePreference,
} from "./themeUtils";

type ThemeState = {
  currentTheme: "light" | "dark";
  themePreference: ThemePreference;
};

const getInitialThemePreference = (): ThemePreference => {
  const storedTheme = getCookie("theme");
  return isThemePreference(storedTheme) ? storedTheme : "light";
};

const initialThemePreference = getInitialThemePreference();

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: resolveThemePreference(initialThemePreference),
    themePreference: initialThemePreference,
  } as ThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemePreference>) => {
      const newThemePreference = action.payload;
      state.themePreference = newThemePreference;
      state.currentTheme = resolveThemePreference(newThemePreference);
      setCookie("theme", newThemePreference, 365);
    },
    syncSystemTheme: (state) => {
      if (state.themePreference !== "system") return;
      state.currentTheme = resolveThemePreference("system");
    },
  },
});

export const { setTheme, syncSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
