import { combineReducers } from "redux";
import languageSlice from "store/slices/common/languageSlice";
import themeSlice from "store/slices/common/themeSlice";
import animationsSlice from "store/slices/common/animationsSlice";

const rootReducer = combineReducers({
  theme: themeSlice,
  language: languageSlice,
  animations: animationsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
