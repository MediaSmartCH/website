import { createSlice } from "@reduxjs/toolkit";

const systemLanguage = navigator.language || (navigator as any).userLanguage;

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLanguage: /^fr\b/.test(systemLanguage) ? 'fr' : 'en',
    // currentLanguage: systemLanguage.startsWith('fr') ? 'fr' : 'en',
    // currentLanguage: "fr",
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
