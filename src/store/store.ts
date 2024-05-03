import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer/rootReducer";
const devTools =
  process.env.NODE_ENV === "development"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

const store = configureStore({
  reducer: rootReducer,
  devTools,
});

export { store };
export type AppDispatch = typeof store.dispatch;
