/**
 * @vitest-environment jsdom
 *
 * docs-layout-shell.test.jsx
 *
 * Integration-level tests for the DocsLayoutShell client component.
 *
 * Coverage
 * ────────
 * 1. Static rendering — sidebar, content area, mobile top-bar all mount.
 * 2. Hamburger toggle — clicking opens / closes the sidebar.
 * 3. Route change closes sidebar — pathname change triggers close.
 * 4. Escape key closes sidebar.
 * 5. Body scroll lock — overflow:hidden applied while open, cleared on close.
 * 6. Backdrop click closes sidebar (delegated to Sidebar's onClose prop).
 * 7. Sidebar close button closes sidebar.
 * 8. Children are rendered inside the content area.
 * 9. Nav links for all doc sections are present.
 * 10. Active route is marked with aria-current="page".
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// ─── Module mocks ────────────────────────────────────────────────────────────
// Must be declared before imports so vitest can hoist them.

let mockPathname = "/docs/getting-started";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, onClick, ...rest }) =>
    React.createElement("a", { href, onClick, ...rest }, children),
}));

// ─── Import after mocks ───────────────────────────────────────────────────────

import DocsLayoutShell from "./docs-layout-shell.jsx";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderShell(children = null) {
  return render(
    React.createElement(
      DocsLayoutShell,
      null,
      children ?? React.createElement("p", null, "Page content")
    )
  );
}

// ─── 1. Static rendering ─────────────────────────────────────────────────────

describe("DocsLayoutShell — static rendering", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("renders the sidebar landmark", () => {
    renderShell();
    // <Sidebar> renders <aside aria-label="Sidebar">
    expect(screen.getByRole("complementary", { name: "Sidebar" })).toBeDefined();
  });

  it("renders the docs content div with id='main-content'", () => {
    renderShell();
    expect(document.getElementById("main-content")).not.toBeNull();
  });

  it("renders a mobile top-bar header", () => {
    renderShell();
    expect(screen.getByTestId("docs-mobile-topbar")).toBeDefined();
  });

  it("renders the 'ClawFactory Docs' label in the mobile top-bar", () => {
    renderShell();
    expect(screen.getByText("ClawFactory Docs")).toBeDefined();
  });

  it("renders children inside the content area", () => {
    renderShell(
      React.createElement("p", { "data-testid": "child" }, "Hello world")
    );
    const content = document.getElementById("main-content");
    expect(content.contains(screen.getByTestId("child"))).toBe(true);
  });

  it("hamburger button is present in the DOM on initial render", () => {
    renderShell();
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });
});

// ─── 2. Hamburger toggle ─────────────────────────────────────────────────────

describe("DocsLayoutShell — hamburger toggle", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("sidebar starts closed (hamburger shows 'Open' label)", () => {
    renderShell();
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });

  it("clicking hamburger opens the sidebar (label changes to 'Close')", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    expect(
      screen.getByRole("button", { name: /close navigation menu/i })
    ).toBeDefined();
  });

  it("clicking hamburger again closes the sidebar", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /close navigation menu/i })
    );
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });

  it("aria-expanded is 'false' when sidebar is closed", () => {
    renderShell();
    expect(
      screen
        .getByRole("button", { name: /open navigation menu/i })
        .getAttribute("aria-expanded")
    ).toBe("false");
  });

  it("aria-expanded is 'true' when sidebar is open", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    expect(
      screen
        .getByRole("button", { name: /close navigation menu/i })
        .getAttribute("aria-expanded")
    ).toBe("true");
  });
});

// ─── 3. Route change closes sidebar ──────────────────────────────────────────

describe("DocsLayoutShell — route change closes sidebar", () => {
  it("closes the sidebar when the pathname changes", () => {
    mockPathname = "/docs/getting-started";
    const { rerender } = renderShell();

    // Open sidebar
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    expect(
      screen.getByRole("button", { name: /close navigation menu/i })
    ).toBeDefined();

    // Simulate navigation to a different route
    mockPathname = "/docs/concepts";
    act(() => {
      rerender(
        React.createElement(
          DocsLayoutShell,
          null,
          React.createElement("p", null, "Concepts content")
        )
      );
    });

    // Sidebar should be closed
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });
});

// ─── 4. Escape key closes sidebar ────────────────────────────────────────────

describe("DocsLayoutShell — Escape key", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("pressing Escape closes the open sidebar", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });

  it("pressing Escape when sidebar is already closed does nothing", () => {
    renderShell();
    // Should not throw
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });

  it("pressing a non-Escape key does not close the open sidebar", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    fireEvent.keyDown(document, { key: "Tab" });
    // Should still be open
    expect(
      screen.getByRole("button", { name: /close navigation menu/i })
    ).toBeDefined();
  });
});

// ─── 5. Body scroll lock ─────────────────────────────────────────────────────

describe("DocsLayoutShell — body scroll lock", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("sets overflow:hidden on body while sidebar is open", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("clears overflow when sidebar is closed", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /close navigation menu/i })
    );
    expect(document.body.style.overflow).toBe("");
  });
});

// ─── 6. Backdrop click closes sidebar ────────────────────────────────────────

describe("DocsLayoutShell — backdrop", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("renders a backdrop when sidebar is open", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    expect(screen.getByTestId("sidebar-backdrop")).toBeDefined();
  });

  it("does not render a backdrop when sidebar is closed", () => {
    renderShell();
    expect(screen.queryByTestId("sidebar-backdrop")).toBeNull();
  });

  it("clicking the backdrop closes the sidebar", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    fireEvent.click(screen.getByTestId("sidebar-backdrop"));
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });
});

// ─── 7. Sidebar close button ─────────────────────────────────────────────────

describe("DocsLayoutShell — sidebar close button", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("sidebar renders a close button when open", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    // The sidebar's internal close button has aria-label="Close sidebar".
    expect(
      screen.getByRole("button", { name: "Close sidebar" })
    ).toBeDefined();
  });

  it("clicking the sidebar close button closes the sidebar", () => {
    renderShell();
    fireEvent.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );
    // Click the Sidebar's own internal close button (aria-label="Close sidebar").
    fireEvent.click(screen.getByRole("button", { name: "Close sidebar" }));
    expect(
      screen.getByRole("button", { name: /open navigation menu/i })
    ).toBeDefined();
  });
});

// ─── 9. Nav links rendered ───────────────────────────────────────────────────

describe("DocsLayoutShell — nav links", () => {
  beforeEach(() => {
    mockPathname = "/docs/getting-started";
  });

  it("renders Getting Started nav link", () => {
    renderShell();
    expect(
      screen.getAllByRole("link", { name: /getting started/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders Core Concepts nav link", () => {
    renderShell();
    expect(
      screen.getAllByRole("link", { name: /core concepts/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders CLI Reference nav link", () => {
    renderShell();
    expect(
      screen.getAllByRole("link", { name: /cli reference/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders Writing a Spec nav link", () => {
    renderShell();
    expect(
      screen.getAllByRole("link", { name: /writing a spec/i }).length
    ).toBeGreaterThan(0);
  });

  it("renders Templates nav link", () => {
    renderShell();
    expect(
      screen.getAllByRole("link", { name: /templates/i }).length
    ).toBeGreaterThan(0);
  });
});

// ─── 10. Active route highlight ──────────────────────────────────────────────

describe("DocsLayoutShell — active route highlight", () => {
  it("marks the active route link with aria-current='page'", () => {
    mockPathname = "/docs/concepts";
    renderShell();
    const activeLinks = screen
      .getAllByRole("link", { name: /core concepts/i })
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(activeLinks.length).toBeGreaterThan(0);
  });

  it("does not mark inactive links with aria-current", () => {
    mockPathname = "/docs/concepts";
    renderShell();
    const inactiveLinks = screen
      .getAllByRole("link", { name: /getting started/i })
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(inactiveLinks.length).toBe(0);
  });

  it("no link marked active on unrecognised route", () => {
    mockPathname = "/docs/unknown";
    renderShell();
    const allActiveLinks = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("aria-current") === "page");
    expect(allActiveLinks.length).toBe(0);
  });
});
