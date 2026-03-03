/**
 * templates.test.js — data-contract tests for /src/lib/templates.js
 *
 * These tests verify the shape and content of every exported constant.
 * Because the page component consumes these constants directly, passing
 * these tests means the page has the data it needs to render correctly.
 */

import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_ANATOMY,
  TEMPLATE_ENV_VARS,
  DECISION_MATRIX,
} from "./templates.js";

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATES
   ───────────────────────────────────────────────────────────────────────── */

describe("TEMPLATES — shape contract", () => {
  it("exports exactly two templates", () => {
    expect(TEMPLATES).toHaveLength(2);
  });

  it("first template is nextjs-tailwind", () => {
    expect(TEMPLATES[0].id).toBe("nextjs-tailwind");
    expect(TEMPLATES[0].name).toBe("nextjs-tailwind");
  });

  it("second template is nextjs-supabase-stripe", () => {
    expect(TEMPLATES[1].id).toBe("nextjs-supabase-stripe");
    expect(TEMPLATES[1].name).toBe("nextjs-supabase-stripe");
  });

  it("every template has all required string fields", () => {
    for (const t of TEMPLATES) {
      expect(typeof t.id).toBe("string");
      expect(t.id.length).toBeGreaterThan(0);
      expect(typeof t.name).toBe("string");
      expect(t.name.length).toBeGreaterThan(0);
      expect(typeof t.icon).toBe("string");
      expect(t.icon.length).toBeGreaterThan(0);
      expect(typeof t.description).toBe("string");
      expect(t.description.length).toBeGreaterThan(0);
      expect(typeof t.when).toBe("string");
      expect(t.when.length).toBeGreaterThan(0);
    }
  });

  it("every template has a non-empty stack array", () => {
    for (const t of TEMPLATES) {
      expect(Array.isArray(t.stack)).toBe(true);
      expect(t.stack.length).toBeGreaterThan(0);
      for (const label of t.stack) {
        expect(typeof label).toBe("string");
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });

  it("template ids are unique", () => {
    const ids = TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("template ids are kebab-case strings", () => {
    for (const { id } of TEMPLATES) {
      expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});

describe("TEMPLATES — nextjs-tailwind content", () => {
  const t = TEMPLATES.find((x) => x.id === "nextjs-tailwind");

  it("stack includes Next.js 15 and TailwindCSS 4", () => {
    expect(t.stack).toContain("Next.js 15");
    expect(t.stack).toContain("TailwindCSS 4");
  });

  it("stack does NOT include Supabase or Stripe", () => {
    expect(t.stack).not.toContain("Supabase");
    expect(t.stack).not.toContain("Stripe");
  });

  it("note is null (no extra callout needed)", () => {
    expect(t.note).toBeNull();
  });

  it("description mentions App Router or server components", () => {
    expect(t.description.toLowerCase()).toMatch(/app router|server component/);
  });

  it("'when' guidance mentions frontend or data layer", () => {
    expect(t.when.toLowerCase()).toMatch(/frontend|data layer/);
  });
});

describe("TEMPLATES — nextjs-supabase-stripe content", () => {
  const t = TEMPLATES.find((x) => x.id === "nextjs-supabase-stripe");

  it("stack includes all four technologies", () => {
    expect(t.stack).toContain("Next.js 15");
    expect(t.stack).toContain("TailwindCSS 4");
    expect(t.stack).toContain("Supabase");
    expect(t.stack).toContain("Stripe");
  });

  it("note is a non-empty string", () => {
    expect(typeof t.note).toBe("string");
    expect(t.note.length).toBeGreaterThan(0);
  });

  it("note mentions required env vars", () => {
    expect(t.note).toContain("SUPABASE_URL");
    expect(t.note).toContain("STRIPE_SECRET_KEY");
  });

  it("description mentions auth, Stripe, and Row Level Security", () => {
    expect(t.description.toLowerCase()).toMatch(/supabase|auth/);
    expect(t.description.toLowerCase()).toMatch(/stripe/);
    expect(t.description.toLowerCase()).toMatch(/row level security|rls/);
  });

  it("'when' guidance mentions SaaS, auth, or billing", () => {
    expect(t.when.toLowerCase()).toMatch(/saas|auth|billing|subscription/);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATE_ANATOMY
   ───────────────────────────────────────────────────────────────────────── */

describe("TEMPLATE_ANATOMY — shape contract", () => {
  it("exports exactly three anatomy items", () => {
    expect(TEMPLATE_ANATOMY).toHaveLength(3);
  });

  it("every anatomy item has a non-empty path and desc", () => {
    for (const item of TEMPLATE_ANATOMY) {
      expect(typeof item.path).toBe("string");
      expect(item.path.length).toBeGreaterThan(0);
      expect(typeof item.desc).toBe("string");
      expect(item.desc.length).toBeGreaterThan(0);
    }
  });

  it("anatomy paths are unique", () => {
    const paths = TEMPLATE_ANATOMY.map((a) => a.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("TEMPLATE_ANATOMY — expected parts present", () => {
  it("includes template.json", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "template.json");
    expect(item).toBeDefined();
  });

  it("includes files/ directory", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "files/");
    expect(item).toBeDefined();
  });

  it("includes hooks/ directory", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "hooks/");
    expect(item).toBeDefined();
  });
});

describe("TEMPLATE_ANATOMY — content accuracy", () => {
  it("template.json description mentions metadata and env vars", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "template.json");
    expect(item.desc.toLowerCase()).toMatch(/metadata|env/);
  });

  it("files/ description mentions scaffold or substitution", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "files/");
    expect(item.desc.toLowerCase()).toMatch(/scaffold|substitut/);
  });

  it("hooks/ description mentions lifecycle or post-init", () => {
    const item = TEMPLATE_ANATOMY.find((a) => a.path === "hooks/");
    expect(item.desc.toLowerCase()).toMatch(/lifecycle|post-init/);
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATE_ENV_VARS
   ───────────────────────────────────────────────────────────────────────── */

describe("TEMPLATE_ENV_VARS — shape contract", () => {
  it("exports at least 7 env var rows", () => {
    expect(TEMPLATE_ENV_VARS.length).toBeGreaterThanOrEqual(7);
  });

  it("every row has varName, template, and purpose fields", () => {
    for (const row of TEMPLATE_ENV_VARS) {
      expect(typeof row.varName).toBe("string");
      expect(row.varName.length).toBeGreaterThan(0);
      expect(typeof row.template).toBe("string");
      expect(row.template.length).toBeGreaterThan(0);
      expect(typeof row.purpose).toBe("string");
      expect(row.purpose.length).toBeGreaterThan(0);
    }
  });

  it("varNames are unique", () => {
    const names = TEMPLATE_ENV_VARS.map((r) => r.varName);
    expect(new Set(names).size).toBe(names.length);
  });

  it("varNames are SCREAMING_SNAKE_CASE", () => {
    for (const { varName } of TEMPLATE_ENV_VARS) {
      expect(varName).toMatch(/^[A-Z][A-Z0-9_]+$/);
    }
  });

  it("template field is either 'all' or a known template id", () => {
    const validTemplates = new Set(["all", "nextjs-tailwind", "nextjs-supabase-stripe"]);
    for (const { template } of TEMPLATE_ENV_VARS) {
      expect(validTemplates.has(template)).toBe(true);
    }
  });
});

describe("TEMPLATE_ENV_VARS — required variables present", () => {
  const varNames = () => TEMPLATE_ENV_VARS.map((r) => r.varName);

  it("includes ANTHROPIC_API_KEY", () => {
    expect(varNames()).toContain("ANTHROPIC_API_KEY");
  });

  it("includes GITHUB_TOKEN", () => {
    expect(varNames()).toContain("GITHUB_TOKEN");
  });

  it("includes SUPABASE_URL", () => {
    expect(varNames()).toContain("SUPABASE_URL");
  });

  it("includes SUPABASE_ANON_KEY", () => {
    expect(varNames()).toContain("SUPABASE_ANON_KEY");
  });

  it("includes SUPABASE_SERVICE_ROLE_KEY", () => {
    expect(varNames()).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("includes STRIPE_SECRET_KEY", () => {
    expect(varNames()).toContain("STRIPE_SECRET_KEY");
  });

  it("includes STRIPE_WEBHOOK_SECRET", () => {
    expect(varNames()).toContain("STRIPE_WEBHOOK_SECRET");
  });
});

describe("TEMPLATE_ENV_VARS — template scoping is correct", () => {
  it("ANTHROPIC_API_KEY is required by all templates", () => {
    const row = TEMPLATE_ENV_VARS.find((r) => r.varName === "ANTHROPIC_API_KEY");
    expect(row.template).toBe("all");
  });

  it("GITHUB_TOKEN is required by all templates", () => {
    const row = TEMPLATE_ENV_VARS.find((r) => r.varName === "GITHUB_TOKEN");
    expect(row.template).toBe("all");
  });

  it("SUPABASE_URL is scoped to nextjs-supabase-stripe", () => {
    const row = TEMPLATE_ENV_VARS.find((r) => r.varName === "SUPABASE_URL");
    expect(row.template).toBe("nextjs-supabase-stripe");
  });

  it("STRIPE_SECRET_KEY is scoped to nextjs-supabase-stripe", () => {
    const row = TEMPLATE_ENV_VARS.find((r) => r.varName === "STRIPE_SECRET_KEY");
    expect(row.template).toBe("nextjs-supabase-stripe");
  });

  it("STRIPE_WEBHOOK_SECRET is scoped to nextjs-supabase-stripe", () => {
    const row = TEMPLATE_ENV_VARS.find((r) => r.varName === "STRIPE_WEBHOOK_SECRET");
    expect(row.template).toBe("nextjs-supabase-stripe");
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   DECISION_MATRIX
   ───────────────────────────────────────────────────────────────────────── */

describe("DECISION_MATRIX — shape contract", () => {
  it("exports at least 7 decision rows", () => {
    expect(DECISION_MATRIX.length).toBeGreaterThanOrEqual(7);
  });

  it("every row has a non-empty need and template", () => {
    for (const row of DECISION_MATRIX) {
      expect(typeof row.need).toBe("string");
      expect(row.need.length).toBeGreaterThan(0);
      expect(typeof row.template).toBe("string");
      expect(row.template.length).toBeGreaterThan(0);
    }
  });

  it("all template values are known template ids", () => {
    const validIds = new Set(TEMPLATES.map((t) => t.id));
    for (const { template } of DECISION_MATRIX) {
      expect(validIds.has(template)).toBe(true);
    }
  });

  it("need values are unique", () => {
    const needs = DECISION_MATRIX.map((r) => r.need);
    expect(new Set(needs).size).toBe(needs.length);
  });
});

describe("DECISION_MATRIX — content coverage", () => {
  it("at least one row maps to nextjs-tailwind", () => {
    const tailwindRows = DECISION_MATRIX.filter(
      (r) => r.template === "nextjs-tailwind"
    );
    expect(tailwindRows.length).toBeGreaterThan(0);
  });

  it("at least one row maps to nextjs-supabase-stripe", () => {
    const stripeRows = DECISION_MATRIX.filter(
      (r) => r.template === "nextjs-supabase-stripe"
    );
    expect(stripeRows.length).toBeGreaterThan(0);
  });

  it("auth-related needs map to nextjs-supabase-stripe", () => {
    const authRows = DECISION_MATRIX.filter((r) =>
      r.need.toLowerCase().match(/auth|sign.?up|login/i)
    );
    expect(authRows.length).toBeGreaterThan(0);
    for (const row of authRows) {
      expect(row.template).toBe("nextjs-supabase-stripe");
    }
  });

  it("billing-related needs map to nextjs-supabase-stripe", () => {
    const billingRows = DECISION_MATRIX.filter((r) =>
      r.need.toLowerCase().match(/billing|stripe|subscription/i)
    );
    expect(billingRows.length).toBeGreaterThan(0);
    for (const row of billingRows) {
      expect(row.template).toBe("nextjs-supabase-stripe");
    }
  });

  it("frontend / static site needs map to nextjs-tailwind", () => {
    const frontendRows = DECISION_MATRIX.filter((r) =>
      r.need.toLowerCase().match(/frontend|docs|marketing/i)
    );
    expect(frontendRows.length).toBeGreaterThan(0);
    for (const row of frontendRows) {
      expect(row.template).toBe("nextjs-tailwind");
    }
  });
});
