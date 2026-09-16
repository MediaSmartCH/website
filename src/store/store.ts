import { configureStore, type DevToolsEnhancerOptions } from "@reduxjs/toolkit";

import rootReducer from "@store/rootReducer/rootReducer";

/**
 * The Redux DevTools extension injects itself onto `window`. Declaring the one
 * property we read keeps the cast in one place instead of at each use.
 */
type DevtoolsWindow = Window & {
  __REDUX_DEVTOOLS_EXTENSION__?: () => DevToolsEnhancerOptions;
};

// Enable Redux DevTools only in development.
const devTools =
  import.meta.env.NODE_ENV === "development"
    ? (window as DevtoolsWindow).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as DevtoolsWindow).__REDUX_DEVTOOLS_EXTENSION__!()
    : undefined;

const store = configureStore({
  reducer: rootReducer,
  devTools,
});

export { store };
export type AppDispatch = typeof store.dispatch;
