/**
 * @vitest-environment jsdom
 *
 * footer.test.jsx — Tests for the Footer component.
 *
 * Strategy
 * ────────
 * • Mock next/link to render a plain <a> (no router required).
 * • Mount <Footer /> and assert structure, links, badge, and accessibility.
 * • All external-link attributes (target, rel, aria-label) are validated.
 * • "Built with ClawFactory" badge presence is verified.
 * • Copyright year is verified to match the current year.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

/* ── Mock next/link ─────────────────────────────────────────────────────── */
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) =>
    React.createElement("a", { href, ...rest }, children),
}));

/* ── Import component AFTER mocks ────────────────────────────────────────── */
import { Footer } from "./footer.jsx";

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function renderFooter() {
  return render(<Footer />);
}

/* ─────────────────────────────────────────────────────────────────────────── */

describe("Footer", () => {

  /* ── Element structure ────────────────────────────────────────────────── */

  it("renders a <footer> element with role='contentinfo'", () => {
    renderFooter();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has an aria-label of 'Site footer'", () => {
    renderFooter();
    expect(screen.getByRole("contentinfo")).toHaveAttribute(
      "aria-label",
      "Site footer"
    );
  });

  /* ── Brand / logo ─────────────────────────────────────────────────────── */

  it("renders the ClawFactory wordmark", () => {
    renderFooter();
    // The logo link text contains "ClawFactory"
    expect(screen.getByRole("link", { name: /ClawFactory home/i })).toBeInTheDocument();
  });

  it("logo link points to '/'", () => {
    renderFooter();
    const logoLink = screen.getByRole("link", { name: /ClawFactory home/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the tagline description", () => {
    renderFooter();
    expect(screen.getByText(/spec-driven software factory/i)).toBeInTheDocument();
  });

  /* ── Documentation nav links ─────────────────────────────────────────── */

  it("renders a 'Documentation' navigation region", () => {
    renderFooter();
    expect(
      screen.getByRole("navigation", { name: /documentation links/i })
    ).toBeInTheDocument();
  });

  it("renders the Getting Started link pointing to /docs/getting-started", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /getting started/i });
    expect(link).toHaveAttribute("href", "/docs/getting-started");
  });

  it("renders the Core Concepts link pointing to /docs/concepts", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /core concepts/i });
    expect(link).toHaveAttribute("href", "/docs/concepts");
  });

  it("renders the CLI Reference link pointing to /docs/cli", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /cli reference/i });
    expect(link).toHaveAttribute("href", "/docs/cli");
  });

  it("renders the Writing a Spec link pointing to /docs/writing-specs", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /writing a spec/i });
    expect(link).toHaveAttribute("href", "/docs/writing-specs");
  });

  it("renders the Templates link pointing to /docs/templates", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /templates/i });
    expect(link).toHaveAttribute("href", "/docs/templates");
  });

  /* ── Project / external links ─────────────────────────────────────────── */

  it("renders a 'Project links' navigation region", () => {
    renderFooter();
    expect(
      screen.getByRole("navigation", { name: /project links/i })
    ).toBeInTheDocument();
  });

  it("renders the GitHub link pointing to the repository", () => {
    renderFooter();
    const link = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/Moltology/factory"
    );
  });

  it("GitHub link opens in a new tab", () => {
    renderFooter();
    const link = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("GitHub link has rel='noopener noreferrer'", () => {
    renderFooter();
    const link = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("GitHub link has an aria-label for screen readers", () => {
    renderFooter();
    const link = screen.getByRole("link", {
      name: /view clawfactory on github/i,
    });
    expect(link).toHaveAttribute("aria-label");
  });

  /* ── "Built with ClawFactory" badge ──────────────────────────────────── */

  it("renders the 'Built with ClawFactory' badge", () => {
    renderFooter();
    expect(screen.getByTestId("built-with-badge")).toBeInTheDocument();
  });

  it("'Built with ClawFactory' badge contains the expected text", () => {
    renderFooter();
    expect(screen.getByTestId("built-with-badge")).toHaveTextContent(
      "Built with ClawFactory"
    );
  });

  /* ── Copyright ────────────────────────────────────────────────────────── */

  it("renders a copyright notice", () => {
    renderFooter();
    expect(screen.getByText(/ClawFactory\. All rights reserved\./i)).toBeInTheDocument();
  });

  it("copyright shows the current year", () => {
    renderFooter();
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  /* ── Section headings ─────────────────────────────────────────────────── */

  it("renders a 'Documentation' section heading", () => {
    renderFooter();
    expect(screen.getByText(/^documentation$/i)).toBeInTheDocument();
  });

  it("renders a 'Project' section heading", () => {
    renderFooter();
    expect(screen.getByText(/^project$/i)).toBeInTheDocument();
  });

  /* ── Accessibility ────────────────────────────────────────────────────── */

  it("all internal doc links do not have target='_blank'", () => {
    renderFooter();
    const docHrefs = [
      "/docs/getting-started",
      "/docs/concepts",
      "/docs/cli",
      "/docs/writing-specs",
      "/docs/templates",
    ];
    for (const href of docHrefs) {
      const link = screen.getByRole("link", { name: (name, el) => el.getAttribute("href") === href });
      expect(link).not.toHaveAttribute("target", "_blank");
    }
  });

  it("renders exactly 5 documentation nav links", () => {
    renderFooter();
    const docsNav = screen.getByRole("navigation", { name: /documentation links/i });
    const links = docsNav.querySelectorAll("a");
    expect(links).toHaveLength(5);
  });
});
