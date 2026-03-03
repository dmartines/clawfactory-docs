/**
 * @vitest-environment jsdom
 *
 * Tests for the useTheme hook.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./use-theme.js";

const STORAGE_KEY = "clawfactory-theme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset dark class
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to 'dark' when no preference is stored", () => {
    // jsdom matchMedia returns false by default (no prefers-color-scheme)
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("reads 'light' from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("reads 'dark' from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("adds .dark class to <html> when theme is dark", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes .dark class from <html> when theme is light", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem(STORAGE_KEY, "light");
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme switches dark → light", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme switches light → dark", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("persists theme to localStorage after toggle", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("updates <html> class after toggle", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggleTheme is a stable reference across renders", () => {
    const { result, rerender } = renderHook(() => useTheme());
    const first = result.current.toggleTheme;
    rerender();
    expect(result.current.toggleTheme).toBe(first);
  });

  it("ignores unknown values stored in localStorage and defaults to dark", () => {
    localStorage.setItem(STORAGE_KEY, "system"); // invalid value
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("handles localStorage.getItem throwing gracefully", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    // Should not throw, fallback to "dark"
    expect(() => renderHook(() => useTheme())).not.toThrow();
  });
});
