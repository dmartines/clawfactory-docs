"use client";

import { createContext, useContext } from "react";
import { useTheme } from "@/hooks/use-theme.js";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

/**
 * ThemeProvider — wraps the application and exposes the current theme +
 * toggle function via context. Must be rendered inside a Client boundary.
 */
export function ThemeProvider({ children }) {
  const themeValue = useTheme();
  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

/**
 * useThemeContext — convenience hook for consuming the theme context.
 */
export function useThemeContext() {
  return useContext(ThemeContext);
}
