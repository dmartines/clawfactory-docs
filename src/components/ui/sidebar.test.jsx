/**
 * @vitest-environment jsdom
 *
 * sidebar.test.jsx
 *
 * Unit tests for the Sidebar component and the DOC_NAV data it renders.
 *
 * Strategy
 * ────────
 * • vi.mock() calls are hoisted — they must come before any imports that
 *   transitively use the mocked modules.
 * • We mock next/navigation so usePathname() is controllable per-test.
 * • We mock next/link so Link renders a plain <a> without a router.
 * • The data-layer (DOC_NAV / DOC_NAV_FLAT) is tested independently.
 * • Component tests cover rendering, active highlighting, and mobile UX.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// ─── Module mocks ─────────────────────────────────────────────────────────────
// These must be declared before the component import so vitest can hoist them.

// Mutable ref — individual tests mutate this to control the active route.
let mockPathname = "/docs/getting-started";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, onClick, ...rest }) =>
    React.createElement("a", { href, onClick, ...rest }, children),
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import Sidebar from "./sidebar.jsx";
import { DOC_NAV, DOC_NAV_FLAT } from "../../lib/docs-nav.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderSidebar(props = {}) {
  return render(
    React.createElement(Sidebar, {
      isOpen: false,
      onClose: () => {},
      ...props,
    })
  );
}

// ─── Data layer tests ─────────────────────────────────────────────────────────

describe("DOC_NAV data", () => {
  it("exports a non-empty DOC_NAV array", () => {
    expect(Array.isArray(DOC_NAV)).toBe(true);
    expect(DOC_NAV.length).toBeGreaterThan(0);
  });

  it("every group has a string label and at least one item", () => {
    for (const section of DOC_NAV) {
      expect(typeof section.group).toBe("string");
      expect(section.group.length).toBeGreaterThan(0);
      expect(Array.isArray(section.items)).toBe(true);
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("every nav item has a non-empty label and an href starting with /docs/", () => {
    for (const item of DOC_NAV_FLAT) {
      expect(typeof item.label).toBe("string");
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href).toMatch(/^\/docs\//);
    }
  });

  it("DOC_NAV_FLAT hrefs are unique (no duplicate routes)", () => {
    const hrefs = DOC_NAV_FLAT.map((i) => i.href);
    const unique = new Set(hrefs);
    expect(unique.size).toBe(hrefs.length);
  });

  it("includes all expected doc sections", () => {
    const hrefs = DOC_NAV_FLAT.map((i) => i.href);
    expect(hrefs).toContain("/docs/getting-started");
    expect(hrefs).toContain("/docs/concepts");
    expect(hrefs).toContain("/docs/cli");
    expect(hrefs).toContain("/docs/writing-specs");
    expect(hrefs).toContain("/docs/templates");
  });
});

// ─── Rendering tests ──────────────────────────────────────────────────────────

describe("Sidebar rendering", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("renders all nav labels from DOC_NAV_FLAT", () => {
    renderSidebar();
    for (const item of DOC_NAV_FLAT) {
      // Use getAllByText because a group heading and a nav item may share the
      // same text (e.g. "Getting Started" group + "Getting Started" link).
      const matches = screen.getAllByText(item.label);
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("renders all group headings", () => {
    renderSidebar();
    for (const section of DOC_NAV) {
      // Use getAllByText to handle cases where a group name equals a link label.
      const matches = screen.getAllByText(section.group);
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it("renders nav links with correct hrefs", () => {
    renderSidebar();
    for (const item of DOC_NAV_FLAT) {
      const link = screen.getByRole("link", { name: new RegExp(item.label) });
      expect(link.getAttribute("href")).toBe(item.href);
    }
  });

  it("sidebar element has the correct aria-label", () => {
    renderSidebar();
    expect(
      screen.getByRole("complementary", { name: "Sidebar" })
    ).toBeDefined();
  });

  it("renders the 'View on GitHub' footer link", () => {
    renderSidebar();
    const ghLink = screen.getByRole("link", { name: /view on github/i });
    expect(ghLink.getAttribute("href")).toBe(
      "https://github.com/Moltology/factory"
    );
  });
});

// ─── Active page highlight tests ──────────────────────────────────────────────

describe("Sidebar — active page highlight", () => {
  it("marks the active link with aria-current='page'", () => {
    mockPathname = "/docs/concepts";
    renderSidebar();
    const activeLink = screen.getByRole("link", { name: /core concepts/i });
    expect(activeLink.getAttribute("aria-current")).toBe("page");
  });

  it("does not mark inactive links with aria-current", () => {
    mockPathname = "/docs/concepts";
    renderSidebar();
    const inactiveItems = DOC_NAV_FLAT.filter(
      (i) => i.href !== "/docs/concepts"
    );
    for (const item of inactiveItems) {
      const link = screen.getByRole("link", { name: new RegExp(item.label) });
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });

  it("updates the active link when pathname changes", () => {
    mockPathname = "/docs/cli";
    renderSidebar();
    expect(
      screen
        .getByRole("link", { name: /cli reference/i })
        .getAttribute("aria-current")
    ).toBe("page");
    expect(
      screen
        .getByRole("link", { name: /core concepts/i })
        .getAttribute("aria-current")
    ).toBeNull();
  });

  it("no link is marked active on an unrecognised route", () => {
    mockPathname = "/docs/unknown-page";
    renderSidebar();
    for (const item of DOC_NAV_FLAT) {
      const link = screen.getByRole("link", { name: new RegExp(item.label) });
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });
});

// ─── Mobile behaviour tests ───────────────────────────────────────────────────

describe("Sidebar — mobile open/close", () => {
  it("renders the close button on mobile", () => {
    renderSidebar({ isOpen: true });
    expect(
      screen.getByRole("button", { name: /close navigation/i })
    ).toBeDefined();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    renderSidebar({ isOpen: true, onClose });
    fireEvent.click(screen.getByRole("button", { name: /close navigation/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders a backdrop overlay when isOpen is true", () => {
    renderSidebar({ isOpen: true });
    expect(screen.getByTestId("sidebar-backdrop")).toBeDefined();
  });

  it("does not render a backdrop when isOpen is false", () => {
    renderSidebar({ isOpen: false });
    expect(screen.queryByTestId("sidebar-backdrop")).toBeNull();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    renderSidebar({ isOpen: true, onClose });
    fireEvent.click(screen.getByTestId("sidebar-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when a nav link is clicked", () => {
    const onClose = vi.fn();
    mockPathname = "/docs/getting-started";
    renderSidebar({ isOpen: true, onClose });
    // Click any nav link
    fireEvent.click(screen.getByRole("link", { name: /getting started/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
