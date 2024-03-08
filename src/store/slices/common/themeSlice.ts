import { createSlice } from "@reduxjs/toolkit";

const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: prefersDarkMode ? "dark" : "light",
    // currentTheme: "light",
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
