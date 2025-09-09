import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "./cookieUtils";

const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = getCookie('theme') || (prefersDarkMode ? "dark" : "light");

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: initialTheme,
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      setCookie('theme', action.payload, 365);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;