import "@testing-library/jest-dom";

// jsdom does not implement window.matchMedia — provide a minimal stub so
// components and hooks that call matchMedia don't throw in tests.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
