/**
 * @vitest-environment jsdom
 *
 * feature-card.test.jsx — Tests for the FeatureCard component.
 *
 * Strategy
 * ────────
 * • Data-layer tests: validate that `lib/data/features.js` and
 *   `lib/contracts/feature-card.js` are coherent (no DOM required).
 * • Component-level tests: mount <FeatureCard /> via @testing-library/react
 *   and assert structure, accessibility, and prop-to-DOM mapping.
 * • All three spec-defined feature cards are exercised individually.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

/* ── Data-layer imports (no DOM required) ──────────────────────────────── */
import { FeatureCardSchema, FeatureCardListSchema } from "../../../lib/contracts/feature-card.js";
import { features } from "../../../lib/data/features.js";

/* ── Component import ──────────────────────────────────────────────────── */
import FeatureCard from "./feature-card.jsx";

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: FeatureCardSchema
   ───────────────────────────────────────────────────────────────────────── */

describe("FeatureCardSchema", () => {
  const valid = {
    id: "spec-driven",
    icon: "M9 12h3.75",
    title: "Spec-Driven",
    description: "Write a markdown spec.",
  };

  it("accepts a valid feature card", () => {
    expect(FeatureCardSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a card with a missing id", () => {
    const { id: _omit, ...rest } = valid;
    expect(FeatureCardSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a card whose id is not kebab-case", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, id: "Spec Driven!" }).success
    ).toBe(false);
  });

  it("rejects an id with uppercase letters", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, id: "SpecDriven" }).success
    ).toBe(false);
  });

  it("rejects a card with an empty icon", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, icon: "" }).success
    ).toBe(false);
  });

  it("rejects a title exceeding 60 characters", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, title: "A".repeat(61) }).success
    ).toBe(false);
  });

  it("accepts a title of exactly 60 characters", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, title: "A".repeat(60) }).success
    ).toBe(true);
  });

  it("rejects a description exceeding 200 characters", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, description: "D".repeat(201) }).success
    ).toBe(false);
  });

  it("accepts a description of exactly 200 characters", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, description: "D".repeat(200) }).success
    ).toBe(true);
  });

  it("rejects a card with an empty title", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, title: "" }).success
    ).toBe(false);
  });

  it("rejects a card with an empty description", () => {
    expect(
      FeatureCardSchema.safeParse({ ...valid, description: "" }).success
    ).toBe(false);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: FeatureCardListSchema
   ───────────────────────────────────────────────────────────────────────── */

describe("FeatureCardListSchema", () => {
  const validCard = {
    id: "spec-driven",
    icon: "M9 12h3.75",
    title: "Spec-Driven",
    description: "Write a markdown spec.",
  };

  it("accepts a non-empty array of valid cards", () => {
    expect(FeatureCardListSchema.safeParse([validCard]).success).toBe(true);
  });

  it("accepts a list with multiple valid cards", () => {
    const second = { ...validCard, id: "parallel-agents", title: "Parallel Agents" };
    expect(FeatureCardListSchema.safeParse([validCard, second]).success).toBe(true);
  });

  it("rejects an empty array", () => {
    expect(FeatureCardListSchema.safeParse([]).success).toBe(false);
  });

  it("rejects an array containing an invalid card (empty id)", () => {
    expect(
      FeatureCardListSchema.safeParse([{ ...validCard, id: "" }]).success
    ).toBe(false);
  });

  it("rejects a non-array value", () => {
    expect(FeatureCardListSchema.safeParse(null).success).toBe(false);
    expect(FeatureCardListSchema.safeParse("string").success).toBe(false);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: features data module
   ───────────────────────────────────────────────────────────────────────── */

describe("features data module", () => {
  it("exports exactly three feature cards", () => {
    expect(features).toHaveLength(3);
  });

  it("every card passes the FeatureCardSchema", () => {
    for (const card of features) {
      const result = FeatureCardSchema.safeParse(card);
      expect(result.success, `Card "${card.id}" failed schema validation`).toBe(true);
    }
  });

  it("ids are unique across all cards", () => {
    const ids = features.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains the three spec-defined feature ids", () => {
    const ids = features.map((c) => c.id);
    expect(ids).toContain("spec-driven");
    expect(ids).toContain("parallel-agents");
    expect(ids).toContain("holdout-verification");
  });

  it("each title is between 1 and 60 characters", () => {
    for (const card of features) {
      expect(card.title.length).toBeGreaterThanOrEqual(1);
      expect(card.title.length).toBeLessThanOrEqual(60);
    }
  });

  it("each description is between 1 and 200 characters", () => {
    for (const card of features) {
      expect(card.description.length).toBeGreaterThanOrEqual(1);
      expect(card.description.length).toBeLessThanOrEqual(200);
    }
  });

  it("every card has a non-empty icon path string", () => {
    for (const card of features) {
      expect(typeof card.icon).toBe("string");
      expect(card.icon.trim().length).toBeGreaterThan(0);
    }
  });

  it("spec-driven card has correct title and description", () => {
    const card = features.find((c) => c.id === "spec-driven");
    expect(card).toBeDefined();
    expect(card.title).toBe("Spec-Driven");
    expect(card.description).toMatch(/markdown spec/i);
  });

  it("parallel-agents card has correct title and description", () => {
    const card = features.find((c) => c.id === "parallel-agents");
    expect(card).toBeDefined();
    expect(card.title).toBe("Parallel Agents");
    expect(card.description).toMatch(/concurrent|concurrently/i);
  });

  it("holdout-verification card has correct title and description", () => {
    const card = features.find((c) => c.id === "holdout-verification");
    expect(card).toBeDefined();
    expect(card.title).toBe("Holdout Verification");
    expect(card.description).toMatch(/tests|verified/i);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT: FeatureCard rendering
   ───────────────────────────────────────────────────────────────────────── */

const SPEC_DRIVEN = {
  id: "spec-driven",
  icon: "M9 12h3.75M9 15h3.75",
  title: "Spec-Driven",
  description: "Write a markdown spec. The factory parses it automatically.",
};

const PARALLEL_AGENTS = {
  id: "parallel-agents",
  icon: "m3.75 13.5 10.5-11.25L12 10.5",
  title: "Parallel Agents",
  description: "Independent tasks run concurrently with scoped file access.",
};

describe("FeatureCard component", () => {
  /* ── Structural / element tests ────────────────────────────────────────── */

  it("renders an <article> element", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    expect(container.querySelector("article")).toBeInTheDocument();
  });

  it("uses data-testid based on the card id", () => {
    render(<FeatureCard {...SPEC_DRIVEN} />);
    expect(screen.getByTestId("feature-card-spec-driven")).toBeInTheDocument();
  });

  it("data-testid reflects the passed id prop", () => {
    render(<FeatureCard {...PARALLEL_AGENTS} />);
    expect(
      screen.getByTestId("feature-card-parallel-agents")
    ).toBeInTheDocument();
  });

  /* ── Title ─────────────────────────────────────────────────────────────── */

  it("renders the title text", () => {
    render(<FeatureCard {...SPEC_DRIVEN} />);
    expect(screen.getByText("Spec-Driven")).toBeInTheDocument();
  });

  it("renders the title inside a heading element (h3)", () => {
    render(<FeatureCard {...SPEC_DRIVEN} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Spec-Driven");
  });

  it("renders alternate title text correctly", () => {
    render(<FeatureCard {...PARALLEL_AGENTS} />);
    expect(screen.getByText("Parallel Agents")).toBeInTheDocument();
  });

  /* ── Description ───────────────────────────────────────────────────────── */

  it("renders the description text", () => {
    render(<FeatureCard {...SPEC_DRIVEN} />);
    expect(
      screen.getByText(
        "Write a markdown spec. The factory parses it automatically."
      )
    ).toBeInTheDocument();
  });

  it("description text is inside a <p> element", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    const p = container.querySelector("p");
    expect(p).toBeInTheDocument();
    expect(p.textContent).toBe(
      "Write a markdown spec. The factory parses it automatically."
    );
  });

  /* ── SVG Icon ──────────────────────────────────────────────────────────── */

  it("renders an SVG element", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("SVG uses the provided icon path as the 'd' attribute", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    const path = container.querySelector("svg path");
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute("d", SPEC_DRIVEN.icon);
  });

  it("SVG is aria-hidden to avoid exposing decorative content to screen readers", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("SVG uses a 24×24 viewBox", () => {
    const { container } = render(<FeatureCard {...SPEC_DRIVEN} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  /* ── Props round-trip with real features data ──────────────────────────── */

  it("renders all three feature cards from the data module without error", () => {
    for (const feature of features) {
      const { unmount } = render(<FeatureCard {...feature} />);
      expect(
        screen.getByTestId(`feature-card-${feature.id}`)
      ).toBeInTheDocument();
      unmount();
    }
  });

  it("renders unique data-testid for each feature from the data module", () => {
    const { container } = render(
      <>
        {features.map((f) => (
          <FeatureCard key={f.id} {...f} />
        ))}
      </>
    );
    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(3);
    const testIds = Array.from(articles).map((a) =>
      a.getAttribute("data-testid")
    );
    expect(new Set(testIds).size).toBe(3);
  });

  it("renders all three titles from the data module", () => {
    render(
      <>
        {features.map((f) => (
          <FeatureCard key={f.id} {...f} />
        ))}
      </>
    );
    for (const feature of features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    }
  });

  it("renders all three descriptions from the data module", () => {
    render(
      <>
        {features.map((f) => (
          <FeatureCard key={f.id} {...f} />
        ))}
      </>
    );
    for (const feature of features) {
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    }
  });
});
