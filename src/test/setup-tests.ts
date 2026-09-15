import "@testing-library/jest-dom";

// Provide a default matchMedia stub so modules that call window.matchMedia at
// import time (e.g. animationsSlice) do not throw in the jsdom environment.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Node 25 passes an invalid --localstorage-file flag to jsdom which causes
// the Web Storage objects to be present but empty (no methods). Patch them
// with a minimal in-memory implementation so tests can call localStorage.clear()
// and friends without errors.
function makeStorage() {
  let store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

if (typeof window.localStorage.clear !== "function") {
  Object.defineProperty(window, "localStorage", {
    writable: true,
    value: makeStorage(),
  });
}

if (typeof window.sessionStorage.clear !== "function") {
  Object.defineProperty(window, "sessionStorage", {
    writable: true,
    value: makeStorage(),
  });
}
