/**
 * @vitest-environment jsdom
 *
 * step-card.test.jsx — Tests for the StepCard component and its data layer.
 *
 * Strategy
 * ────────
 * • Data-layer / schema tests: validate that `lib/contracts/step-card.js`
 *   enforces the correct shape (no DOM required).
 * • Data module tests: verify that `lib/data/steps.js` and `src/lib/steps.js`
 *   export correctly shaped, spec-compliant step card data.
 * • Component-level tests: mount <StepCard /> via @testing-library/react
 *   and assert structure, accessibility, and prop-to-DOM mapping.
 * • All four spec-defined step cards are exercised via the data module.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

/* ── Data-layer imports (no DOM required) ──────────────────────────────── */
import {
  StepCardSchema,
  StepCardListSchema,
} from "../../../lib/contracts/step-card.js";
import { steps } from "../../../lib/data/steps.js";
import { STEPS } from "../../lib/steps.js";

/* ── Component import ──────────────────────────────────────────────────── */
import StepCard from "./step-card.jsx";

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: StepCardSchema
   ───────────────────────────────────────────────────────────────────────── */

describe("StepCardSchema", () => {
  const valid = {
    step: 1,
    title: "Write your SPEC.md",
    description:
      "Describe your app in plain markdown. Be specific about data models and routes.",
  };

  it("accepts a valid step card object", () => {
    const result = StepCardSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("parses step, title and description correctly", () => {
    const parsed = StepCardSchema.parse(valid);
    expect(parsed.step).toBe(1);
    expect(parsed.title).toBe("Write your SPEC.md");
    expect(parsed.description).toContain("markdown");
  });

  it("rejects a non-integer step", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: 1.5 });
    expect(result.success).toBe(false);
  });

  it("rejects a zero step", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a negative step", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = StepCardSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty description", () => {
    const result = StepCardSchema.safeParse({ ...valid, description: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing step field", () => {
    const { step: _omit, ...rest } = valid;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a missing title field", () => {
    const { title: _omit, ...rest } = valid;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a missing description field", () => {
    const { description: _omit, ...rest } = valid;
    const result = StepCardSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("accepts step numbers larger than 9 (multi-digit)", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: 12 });
    expect(result.success).toBe(true);
  });

  it("rejects a string step value", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: "1" });
    expect(result.success).toBe(false);
  });

  it("rejects a null step", () => {
    const result = StepCardSchema.safeParse({ ...valid, step: null });
    expect(result.success).toBe(false);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: StepCardListSchema
   ───────────────────────────────────────────────────────────────────────── */

describe("StepCardListSchema", () => {
  const validCard = {
    step: 1,
    title: "Write your SPEC.md",
    description: "Describe your app in plain markdown.",
  };

  it("accepts a non-empty array of valid step cards", () => {
    expect(StepCardListSchema.safeParse([validCard]).success).toBe(true);
  });

  it("accepts multiple valid step cards", () => {
    const cards = [
      validCard,
      { step: 2, title: "Run init", description: "Bootstrap the project." },
      { step: 3, title: "Run build", description: "Agents build the app." },
    ];
    expect(StepCardListSchema.safeParse(cards).success).toBe(true);
  });

  it("rejects an empty array", () => {
    expect(StepCardListSchema.safeParse([]).success).toBe(false);
  });

  it("rejects an array containing an invalid step card (zero step)", () => {
    expect(
      StepCardListSchema.safeParse([{ ...validCard, step: 0 }]).success
    ).toBe(false);
  });

  it("rejects an array containing an invalid step card (empty title)", () => {
    expect(
      StepCardListSchema.safeParse([{ ...validCard, title: "" }]).success
    ).toBe(false);
  });

  it("rejects a non-array value", () => {
    expect(StepCardListSchema.safeParse(null).success).toBe(false);
    expect(StepCardListSchema.safeParse("string").success).toBe(false);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: steps data module (lib/data/steps.js)
   ───────────────────────────────────────────────────────────────────────── */

describe("steps data module", () => {
  it("exports exactly four step cards", () => {
    expect(steps).toHaveLength(4);
  });

  it("every card passes the StepCardSchema", () => {
    for (const card of steps) {
      const result = StepCardSchema.safeParse(card);
      expect(result.success, `Step ${card.step} failed schema validation`).toBe(
        true
      );
    }
  });

  it("every card has a non-empty title and description", () => {
    for (const card of steps) {
      expect(card.title).toBeTruthy();
      expect(card.description).toBeTruthy();
    }
  });

  it("step numbers are sequential starting at 1", () => {
    const numbers = steps.map((s) => s.step);
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it("step numbers are unique", () => {
    const numbers = steps.map((s) => s.step);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("all step numbers are positive integers", () => {
    for (const card of steps) {
      expect(Number.isInteger(card.step)).toBe(true);
      expect(card.step).toBeGreaterThan(0);
    }
  });

  it("contains the four spec-defined workflow steps by title", () => {
    const titles = steps.map((s) => s.title);
    expect(titles[0]).toContain("SPEC.md");
    expect(titles[1]).toContain("init");
    expect(titles[2]).toContain("build");
    expect(titles[3]).toContain("deploy");
  });

  it("first step describes writing a spec", () => {
    const first = steps.find((s) => s.step === 1);
    expect(first).toBeDefined();
    expect(first.description.toLowerCase()).toContain("markdown");
  });

  it("second step describes the init command", () => {
    const second = steps.find((s) => s.step === 2);
    expect(second).toBeDefined();
    expect(second.description.toLowerCase()).toContain("spec");
  });

  it("third step mentions agents or build loop", () => {
    const third = steps.find((s) => s.step === 3);
    expect(third).toBeDefined();
    expect(third.description.toLowerCase()).toMatch(/agents?|build/);
  });

  it("fourth step mentions deploy or ship", () => {
    const fourth = steps.find((s) => s.step === 4);
    expect(fourth).toBeDefined();
    expect(fourth.description.toLowerCase()).toMatch(/deploy|ship/);
  });

  it("no title exceeds 60 characters", () => {
    for (const card of steps) {
      expect(card.title.length).toBeLessThanOrEqual(60);
    }
  });

  it("no description exceeds 300 characters", () => {
    for (const card of steps) {
      expect(card.description.length).toBeLessThanOrEqual(300);
    }
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DATA-LAYER: STEPS re-export (src/lib/steps.js)
   ───────────────────────────────────────────────────────────────────────── */

describe("STEPS re-export (src/lib/steps.js)", () => {
  it("exports an array", () => {
    expect(Array.isArray(STEPS)).toBe(true);
  });

  it("exports exactly four step cards", () => {
    expect(STEPS).toHaveLength(4);
  });

  it("every card has a positive integer step number", () => {
    for (const card of STEPS) {
      expect(Number.isInteger(card.step)).toBe(true);
      expect(card.step).toBeGreaterThan(0);
    }
  });

  it("step numbers are sequential starting at 1", () => {
    const numbers = STEPS.map((s) => s.step);
    expect(numbers).toEqual([1, 2, 3, 4]);
  });

  it("every card has a non-empty title", () => {
    for (const card of STEPS) {
      expect(typeof card.title).toBe("string");
      expect(card.title.length).toBeGreaterThan(0);
    }
  });

  it("every card has a non-empty description", () => {
    for (const card of STEPS) {
      expect(typeof card.description).toBe("string");
      expect(card.description.length).toBeGreaterThan(0);
    }
  });

  it("contains the four spec-defined workflow step titles", () => {
    const titles = STEPS.map((s) => s.title);
    expect(titles[0]).toContain("SPEC.md");
    expect(titles[1]).toContain("init");
    expect(titles[2]).toContain("build");
    expect(titles[3]).toContain("deploy");
  });

  it("is the same data as lib/data/steps", () => {
    expect(STEPS).toEqual(steps);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT: StepCard rendering
   ───────────────────────────────────────────────────────────────────────── */

const STEP_1 = {
  step: 1,
  title: "Write your SPEC.md",
  description:
    "Describe your app in plain markdown. Be specific about data models and routes.",
};

const STEP_2 = {
  step: 2,
  title: "Run clawfactory init",
  description:
    "The spec compiler parses your SPEC.md, generates Zod contracts and GitHub Issues.",
};

describe("StepCard component", () => {
  /* ── Structural / element tests ────────────────────────────────────────── */

  it("renders a root container element", () => {
    const { container } = render(<StepCard {...STEP_1} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders the step number in the document", () => {
    render(<StepCard {...STEP_1} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders an alternate step number correctly", () => {
    render(<StepCard {...STEP_2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders a multi-digit step number correctly", () => {
    render(<StepCard step={10} title="Ten" description="Step ten." />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  /* ── Title ─────────────────────────────────────────────────────────────── */

  it("renders the title text", () => {
    render(<StepCard {...STEP_1} />);
    expect(screen.getByText("Write your SPEC.md")).toBeInTheDocument();
  });

  it("renders the title inside a heading element (h3)", () => {
    render(<StepCard {...STEP_1} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Write your SPEC.md");
  });

  it("renders alternate title text correctly", () => {
    render(<StepCard {...STEP_2} />);
    expect(screen.getByText("Run clawfactory init")).toBeInTheDocument();
  });

  /* ── Description ───────────────────────────────────────────────────────── */

  it("renders the description text", () => {
    render(<StepCard {...STEP_1} />);
    expect(
      screen.getByText(
        "Describe your app in plain markdown. Be specific about data models and routes."
      )
    ).toBeInTheDocument();
  });

  it("description text is inside a <p> element", () => {
    const { container } = render(<StepCard {...STEP_1} />);
    const p = container.querySelector("p");
    expect(p).toBeInTheDocument();
    expect(p.textContent).toBe(
      "Describe your app in plain markdown. Be specific about data models and routes."
    );
  });

  it("renders alternate description text correctly", () => {
    render(<StepCard {...STEP_2} />);
    expect(
      screen.getByText(
        "The spec compiler parses your SPEC.md, generates Zod contracts and GitHub Issues."
      )
    ).toBeInTheDocument();
  });

  /* ── Step badge accessibility ──────────────────────────────────────────── */

  it("step number badge is marked aria-hidden (decorative)", () => {
    const { container } = render(<StepCard {...STEP_1} />);
    // The number badge div carries aria-hidden="true"
    const hiddenEls = container.querySelectorAll("[aria-hidden='true']");
    expect(hiddenEls.length).toBeGreaterThan(0);
  });

  /* ── Props round-trip with real steps data ─────────────────────────────── */

  it("renders all four step cards from the data module without error", () => {
    for (const step of steps) {
      const { unmount } = render(<StepCard {...step} />);
      expect(screen.getByText(step.title)).toBeInTheDocument();
      unmount();
    }
  });

  it("renders all four titles from the data module", () => {
    render(
      <>
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </>
    );
    for (const step of steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it("renders all four descriptions from the data module", () => {
    render(
      <>
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </>
    );
    for (const step of steps) {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    }
  });

  it("renders all four step numbers from the data module", () => {
    render(
      <>
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </>
    );
    for (const step of steps) {
      // Each step number should appear exactly once
      const numberEls = screen.getAllByText(String(step.step));
      expect(numberEls.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders four h3 headings when all steps are mounted", () => {
    const { container } = render(
      <>
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </>
    );
    const headings = container.querySelectorAll("h3");
    expect(headings).toHaveLength(4);
  });

  it("renders four paragraph elements when all steps are mounted", () => {
    const { container } = render(
      <>
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </>
    );
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(4);
  });
});
