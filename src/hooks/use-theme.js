"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * localStorage key. Must match the inline ThemeScript that runs before hydration
 * to avoid a flash of the wrong colour scheme.
 */
export const THEME_STORAGE_KEY = "clawfactory-theme";

/**
 * Resolve the initial theme from localStorage or the OS preference.
 * Priority: localStorage → prefers-color-scheme → "dark" (site default).
 *
 * Runs only on the client; returns "dark" as a safe SSR fallback.
 */
function resolveInitialTheme() {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage may be blocked in sandboxed / private contexts
  }

  try {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  } catch {
    // matchMedia not available (e.g. jsdom without polyfill)
  }

  return "dark";
}

/**
 * useTheme — manages the site's dark / light mode.
 *
 * • Reads the saved preference from localStorage on mount.
 * • Writes the preference back on every toggle.
 * • Adds / removes the `.dark` class on `<html>` so Tailwind's
 *   `dark:` utilities apply correctly.
 *
 * @returns {{ theme: "dark" | "light", toggleTheme: () => void }}
 */
export function useTheme() {
  // Start with "dark" for SSR consistency; will be corrected after mount.
  const [theme, setTheme] = useState("dark");

  // Hydrate from storage / system preference after the first client render.
  useEffect(() => {
    setTheme(resolveInitialTheme());
  }, []);

  // Keep the <html> class and localStorage in sync whenever theme changes.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
