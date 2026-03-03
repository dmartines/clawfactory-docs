/**
 * @vitest-environment jsdom
 *
 * Tests for the Header component.
 *
 * Strategy:
 *  - Mock next/link (renders a plain <a>).
 *  - Mock ./theme-provider to expose a controllable theme context.
 *  - Mount <Header /> and assert structure + behaviour.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

/* ── Mock next/link ─────────────────────────────────────────────────────── */
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) =>
    React.createElement("a", { href, ...rest }, children),
}));

/* ── Controllable theme context stub ────────────────────────────────────── */
const mockToggleTheme = vi.fn();
let mockTheme = "dark";

vi.mock("./theme-provider.js", () => ({
  useThemeContext: () => ({ theme: mockTheme, toggleTheme: mockToggleTheme }),
}));

/* ── Import component AFTER mocks are declared ──────────────────────────── */
import { Header } from "./header.js";

/* ─────────────────────────────────────────────────────────────────────────── */

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "dark";
  });

  /* ── Rendering ────────────────────────────────────────────────────────── */

  it("renders a <header> element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  /* ── Logo ─────────────────────────────────────────────────────────────── */

  it("renders the ClawFactory wordmark", () => {
    render(<Header />);
    expect(screen.getByText("ClawFactory")).toBeInTheDocument();
  });

  it("logo link points to '/'", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /clawfactory.*home/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  /* ── Nav links ────────────────────────────────────────────────────────── */

  it("renders a Docs nav link pointing to /docs/getting-started", () => {
    render(<Header />);
    const docsLink = screen.getByRole("link", { name: /^docs$/i });
    expect(docsLink).toHaveAttribute("href", "/docs/getting-started");
  });

  it("renders a GitHub nav link pointing to the repository", () => {
    render(<Header />);
    const githubLink = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/Moltology/factory"
    );
  });

  it("GitHub link opens in a new tab with proper rel", () => {
    render(<Header />);
    const githubLink = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  /* ── Dark mode toggle — dark theme ───────────────────────────────────── */

  it("renders the theme toggle button", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  it("shows 'Switch to light mode' label when theme is dark", () => {
    mockTheme = "dark";
    render(<Header />);
    expect(
      screen.getByRole("button", { name: /switch to light mode/i })
    ).toBeInTheDocument();
  });

  it("shows 'Switch to dark mode' label when theme is light", () => {
    mockTheme = "light";
    render(<Header />);
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i })
    ).toBeInTheDocument();
  });

  it("calls toggleTheme when the toggle button is clicked", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /switch to/i });
    fireEvent.click(btn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  /* ── Accessibility ────────────────────────────────────────────────────── */

  it("has a <nav> element with an accessible label", () => {
    render(<Header />);
    expect(
      screen.getByRole("navigation", { name: /site navigation/i })
    ).toBeInTheDocument();
  });

  it("theme toggle button has type='button' (not submit)", () => {
    render(<Header />);
    const btn = screen.getByRole("button", { name: /switch to/i });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("logo has an aria-label for screen readers", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /clawfactory.*home/i });
    expect(logoLink).toHaveAttribute("aria-label");
  });

  it("GitHub link has an aria-label for screen readers", () => {
    render(<Header />);
    const githubLink = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(githubLink).toHaveAttribute("aria-label");
  });
});
