import { combineReducers } from "redux";
import languageSlice from "store/slices/common/languageSlice";
import themeSlice from "store/slices/common/themeSlice";

const rootReducer = combineReducers({
  // theme
  theme: themeSlice,
  // Language
  language: languageSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
