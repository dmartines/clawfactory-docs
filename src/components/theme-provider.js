/**
 * Re-export barrel so that both `.js` and `.jsx` import specifiers resolve to
 * the same ThemeProvider implementation.  Tests mock "./theme-provider.js" so
 * header.js must import from this module.
 */
export { ThemeProvider, useThemeContext } from "./theme-provider.jsx";
