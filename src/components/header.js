/**
 * header.js — plain-JS re-export shim.
 *
 * The test file (`header.test.jsx`) imports:
 *   import { Header } from "./header.js";
 *
 * Vite cannot process JSX inside a `.js` file, so the real implementation
 * lives in `header.jsx` (which Vite treats as JSX).  This module simply
 * re-exports everything so both import paths work:
 *
 *   import Header from "@/components/header.jsx";   // Next.js layout
 *   import { Header } from "./header.js";           // tests
 */
export { Header as default, Header } from "./header.jsx";
