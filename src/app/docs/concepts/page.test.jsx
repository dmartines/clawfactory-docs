/**
 * @vitest-environment jsdom
 *
 * page.test.jsx — Tests for the Core Concepts page (/docs/concepts).
 *
 * Strategy
 * ────────
 * • Verify all seven concept sections are rendered with the correct ids,
 *   icons, titles, and taglines.
 * • Verify all permission-tier and model-tier sub-cards are present.
 * • Verify the receipt JSON example block is present.
 * • Verify page-nav links (← Getting Started, CLI Reference →).
 * • Verify the on-page TOC aside is rendered with all 7 anchor links.
 *
 * NOTE: ConceptsToc uses IntersectionObserver which is not available in
 * jsdom. We mock it so the component mounts without throwing.
 */

import React from "react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

// ── Mock Next.js navigation (required by ConceptsToc -> usePathname) ──────────
vi.mock("next/navigation", () => ({
  usePathname: () => "/docs/concepts",
  useRouter: () => ({ push: vi.fn() }),
}));

// ── Mock Next.js Link (renders a plain <a> in tests) ─────────────────────────
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// ── Stub IntersectionObserver (not in jsdom) ──────────────────────────────────
beforeAll(() => {
  if (!global.IntersectionObserver) {
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

import ConceptsPage from "./page.jsx";

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────────────── */

/** Return the section element with the given id. */
function getSection(id) {
  return document.getElementById(id);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tests
   ───────────────────────────────────────────────────────────────────────────── */

describe("ConceptsPage", () => {
  let container;

  beforeAll(() => {
    ({ container } = render(<ConceptsPage />));
  });

  /* ── Page header ──────────────────────────────────────────────────────────── */

  describe("page header", () => {
    it("renders the main heading 'Core Concepts'", () => {
      expect(
        screen.getByRole("heading", { level: 1, name: /core concepts/i })
      ).toBeInTheDocument();
    });

    it("renders the breadcrumb trail showing 'docs / concepts'", () => {
      expect(screen.getByText("docs")).toBeInTheDocument();
      expect(screen.getByText("concepts")).toBeInTheDocument();
    });

    it("renders the page intro paragraph", () => {
      expect(
        screen.getByText(/seven interlocking ideas/i)
      ).toBeInTheDocument();
    });
  });

  /* ── Concept 1: Spec-Driven Development ──────────────────────────────────── */

  describe("Spec-Driven Development section", () => {
    it("has an anchor section with id 'spec-driven'", () => {
      expect(getSection("spec-driven")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /spec-driven development/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/the spec is the single source of truth/i)
      ).toBeInTheDocument();
    });

    it("mentions SPEC.md inline code", () => {
      // At least one code element with SPEC.md content
      const codes = screen.getAllByText("SPEC.md");
      expect(codes.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the key-point about writing SPEC.md first", () => {
      expect(
        screen.getByText(/write spec\.md first/i)
      ).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("📄")).toBeInTheDocument();
    });
  });

  /* ── Concept 2: Three-Tier Permissions ───────────────────────────────────── */

  describe("Three-Tier Permissions section", () => {
    it("has an anchor section with id 'three-tier-permissions'", () => {
      expect(getSection("three-tier-permissions")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /three-tier permissions/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/immutable, negotiable, and autonomous operations/i)
      ).toBeInTheDocument();
    });

    it("renders the IMMUTABLE tier badge", () => {
      expect(screen.getByText("IMMUTABLE")).toBeInTheDocument();
    });

    it("renders the NEGOTIABLE tier badge", () => {
      expect(screen.getByText("NEGOTIABLE")).toBeInTheDocument();
    });

    it("renders the AUTONOMOUS tier badge", () => {
      expect(screen.getByText("AUTONOMOUS")).toBeInTheDocument();
    });

    it("renders the approve command inline code", () => {
      // "clawfactory approve <id>" appears in the NEGOTIABLE description
      const codes = screen.getAllByText(/clawfactory approve/i);
      expect(codes.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("🔐")).toBeInTheDocument();
    });
  });

  /* ── Concept 3: Context Optimizer ────────────────────────────────────────── */

  describe("Context Optimizer section", () => {
    it("has an anchor section with id 'context-optimizer'", () => {
      expect(getSection("context-optimizer")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /context optimizer/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/every token sent to the llm earns its place/i)
      ).toBeInTheDocument();
    });

    it("renders the key-point about context assembled per-task", () => {
      expect(
        screen.getByText(/context is assembled per-task/i)
      ).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("🎯")).toBeInTheDocument();
    });
  });

  /* ── Concept 4: Model Router ─────────────────────────────────────────────── */

  describe("Model Router section", () => {
    it("has an anchor section with id 'model-router'", () => {
      expect(getSection("model-router")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /model router/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/light.*medium.*heavy.*routing/i)
      ).toBeInTheDocument();
    });

    it("renders the LIGHT model tier badge", () => {
      expect(screen.getByText("LIGHT")).toBeInTheDocument();
    });

    it("renders the MEDIUM model tier badge", () => {
      expect(screen.getByText("MEDIUM")).toBeInTheDocument();
    });

    it("renders the HEAVY model tier badge", () => {
      expect(screen.getByText("HEAVY")).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("⚡")).toBeInTheDocument();
    });
  });

  /* ── Concept 5: Spawn System ─────────────────────────────────────────────── */

  describe("Spawn System section", () => {
    it("has an anchor section with id 'spawn-system'", () => {
      expect(getSection("spawn-system")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /spawn system/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/parallel agents with scoped file access/i)
      ).toBeInTheDocument();
    });

    it("renders the key-point about conflict impossibility", () => {
      expect(
        screen.getByText(/conflicts are impossible by construction/i)
      ).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("🪄")).toBeInTheDocument();
    });
  });

  /* ── Concept 6: Receipts ─────────────────────────────────────────────────── */

  describe("Receipts section", () => {
    it("has an anchor section with id 'receipts'", () => {
      expect(getSection("receipts")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /^receipts$/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/structured proof of work for every execution cycle/i)
      ).toBeInTheDocument();
    });

    it("renders the receipt JSON filename in the example block", () => {
      expect(
        screen.getByText(/issue-42-cycle-3\.json/i)
      ).toBeInTheDocument();
    });

    it("renders the receipt JSON content with status field", () => {
      expect(screen.getByText(/"status": "passed"/i)).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("🧾")).toBeInTheDocument();
    });

    it("renders the key-point about receipts being immutable once written", () => {
      expect(
        screen.getByText(/immutable once written/i)
      ).toBeInTheDocument();
    });
  });

  /* ── Concept 7: GitHub Issues as Tasks ───────────────────────────────────── */

  describe("GitHub Issues as Tasks section", () => {
    it("has an anchor section with id 'github-issues'", () => {
      expect(getSection("github-issues")).toBeInTheDocument();
    });

    it("renders the section heading", () => {
      expect(
        screen.getByRole("heading", { name: /github issues as tasks/i })
      ).toBeInTheDocument();
    });

    it("renders the tagline", () => {
      expect(
        screen.getByText(/issues are the task system/i)
      ).toBeInTheDocument();
    });

    it("renders the clawfactory init inline code", () => {
      const codes = screen.getAllByText("clawfactory init");
      expect(codes.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the TASKS.md inline code references", () => {
      const codes = screen.getAllByText("TASKS.md");
      expect(codes.length).toBeGreaterThanOrEqual(1);
    });

    it("renders the key-point about TASKS.md being a cache", () => {
      expect(
        screen.getByText(/tasks\.md is a cache/i)
      ).toBeInTheDocument();
    });

    it("renders the icon badge emoji", () => {
      expect(screen.getByText("🐙")).toBeInTheDocument();
    });
  });

  /* ── On-page TOC ─────────────────────────────────────────────────────────── */

  describe("on-page TOC sidebar", () => {
    it("renders an <aside> with aria-label 'On this page'", () => {
      // The TOC nav has aria-label="On this page"
      expect(
        screen.getByRole("navigation", { name: /on this page/i })
      ).toBeInTheDocument();
    });

    it("renders all 7 TOC anchor links", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      const links = within(nav).getAllByRole("link");
      expect(links).toHaveLength(7);
    });

    it("links to #spec-driven", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /spec-driven development/i })
      ).toHaveAttribute("href", "#spec-driven");
    });

    it("links to #three-tier-permissions", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /three-tier permissions/i })
      ).toHaveAttribute("href", "#three-tier-permissions");
    });

    it("links to #context-optimizer", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /context optimizer/i })
      ).toHaveAttribute("href", "#context-optimizer");
    });

    it("links to #model-router", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /model router/i })
      ).toHaveAttribute("href", "#model-router");
    });

    it("links to #spawn-system", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /spawn system/i })
      ).toHaveAttribute("href", "#spawn-system");
    });

    it("links to #receipts", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /^receipts$/i })
      ).toHaveAttribute("href", "#receipts");
    });

    it("links to #github-issues", () => {
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      expect(
        within(nav).getByRole("link", { name: /github issues as tasks/i })
      ).toHaveAttribute("href", "#github-issues");
    });
  });

  /* ── Page navigation (prev / next) ──────────────────────────────────────── */

  describe("page navigation", () => {
    it("renders a '← Getting Started' back link", () => {
      const link = screen.getByRole("link", { name: /getting started/i });
      expect(link).toHaveAttribute("href", "/docs/getting-started");
    });

    it("renders a 'CLI Reference →' forward link", () => {
      const link = screen.getByRole("link", { name: /cli reference/i });
      expect(link).toHaveAttribute("href", "/docs/cli");
    });
  });

  /* ── All seven concept sections present ──────────────────────────────────── */

  describe("seven concept sections", () => {
    const EXPECTED_SECTION_IDS = [
      "spec-driven",
      "three-tier-permissions",
      "context-optimizer",
      "model-router",
      "spawn-system",
      "receipts",
      "github-issues",
    ];

    it.each(EXPECTED_SECTION_IDS)(
      "section with id '%s' is present in the DOM",
      (id) => {
        expect(getSection(id)).toBeInTheDocument();
      }
    );

    it("exactly seven concept section headings (h2) are rendered", () => {
      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings).toHaveLength(7);
    });
  });
});
