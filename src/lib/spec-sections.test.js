import { describe, it, expect } from "vitest";
import {
  SPEC_SECTIONS,
  SPEC_TIPS,
  COMPILER_ARTEFACTS,
} from "./spec-sections.js";

/* ─── SPEC_SECTIONS ───────────────────────────────────────────────────── */

describe("SPEC_SECTIONS", () => {
  it("exports an array", () => {
    expect(Array.isArray(SPEC_SECTIONS)).toBe(true);
  });

  it("contains exactly seven sections", () => {
    expect(SPEC_SECTIONS).toHaveLength(7);
  });

  it("every section has a non-empty id", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.id).toBe("string");
      expect(s.id.length).toBeGreaterThan(0);
    }
  });

  it("section ids are unique", () => {
    const ids = SPEC_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every section has a non-empty icon", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.icon).toBe("string");
      expect(s.icon.length).toBeGreaterThan(0);
    }
  });

  it("every section has a non-empty label", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.label).toBe("string");
      expect(s.label.length).toBeGreaterThan(0);
    }
  });

  it("every section has a boolean 'required' field", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.required).toBe("boolean");
    }
  });

  it("every section has a non-empty tagline", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.tagline).toBe("string");
      expect(s.tagline.length).toBeGreaterThan(0);
    }
  });

  it("every section has a non-empty description", () => {
    for (const s of SPEC_SECTIONS) {
      expect(typeof s.description).toBe("string");
      expect(s.description.length).toBeGreaterThan(0);
    }
  });

  it("every section has a non-empty fields array", () => {
    for (const s of SPEC_SECTIONS) {
      expect(Array.isArray(s.fields)).toBe(true);
      expect(s.fields.length).toBeGreaterThan(0);
    }
  });

  it("every field entry has a name and note", () => {
    for (const s of SPEC_SECTIONS) {
      for (const f of s.fields) {
        expect(typeof f.name).toBe("string");
        expect(f.name.length).toBeGreaterThan(0);
        expect(typeof f.note).toBe("string");
        expect(f.note.length).toBeGreaterThan(0);
      }
    }
  });

  it("every section has a code example with code, language, and label", () => {
    for (const s of SPEC_SECTIONS) {
      expect(s.example).toBeDefined();
      expect(typeof s.example.code).toBe("string");
      expect(s.example.code.length).toBeGreaterThan(0);
      expect(typeof s.example.language).toBe("string");
      expect(s.example.language.length).toBeGreaterThan(0);
      expect(typeof s.example.label).toBe("string");
      expect(s.example.label.length).toBeGreaterThan(0);
    }
  });

  it("all example languages are 'markdown'", () => {
    for (const s of SPEC_SECTIONS) {
      expect(s.example.language).toBe("markdown");
    }
  });

  it("the first four sections are required", () => {
    const requiredSections = SPEC_SECTIONS.filter((s) => s.required);
    expect(requiredSections).toHaveLength(4);
    expect(requiredSections.map((s) => s.id)).toEqual([
      "what-this-app-is",
      "data-model",
      "api-routes",
      "pages",
    ]);
  });

  it("sections 5-7 are optional", () => {
    const optionalIds = ["auth", "integrations", "non-goals"];
    for (const s of SPEC_SECTIONS) {
      if (optionalIds.includes(s.id)) {
        expect(s.required).toBe(false);
      }
    }
  });

  it("sections are ordered: what-this-app-is first, non-goals last", () => {
    expect(SPEC_SECTIONS[0].id).toBe("what-this-app-is");
    expect(SPEC_SECTIONS[SPEC_SECTIONS.length - 1].id).toBe("non-goals");
  });

  it("contains a data-model section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "data-model");
    expect(found).toBeDefined();
    expect(found.required).toBe(true);
  });

  it("contains an api-routes section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "api-routes");
    expect(found).toBeDefined();
    expect(found.required).toBe(true);
  });

  it("contains a pages section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "pages");
    expect(found).toBeDefined();
    expect(found.required).toBe(true);
  });

  it("contains an auth section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "auth");
    expect(found).toBeDefined();
    expect(found.required).toBe(false);
  });

  it("contains an integrations section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "integrations");
    expect(found).toBeDefined();
    expect(found.required).toBe(false);
  });

  it("contains a non-goals section", () => {
    const found = SPEC_SECTIONS.find((s) => s.id === "non-goals");
    expect(found).toBeDefined();
    expect(found.required).toBe(false);
  });

  it("data-model example code contains a table with columns and types", () => {
    const section = SPEC_SECTIONS.find((s) => s.id === "data-model");
    expect(section.example.code).toContain("uuid");
    expect(section.example.code).toContain("not null");
  });

  it("api-routes example code contains HTTP methods", () => {
    const section = SPEC_SECTIONS.find((s) => s.id === "api-routes");
    const code = section.example.code;
    expect(code).toMatch(/POST|GET|PATCH|DELETE/);
  });

  it("auth example code describes providers and protected routes", () => {
    const section = SPEC_SECTIONS.find((s) => s.id === "auth");
    const code = section.example.code;
    expect(code.toLowerCase()).toContain("provider");
    expect(code.toLowerCase()).toContain("protected");
  });

  it("integrations example code includes env vars", () => {
    const section = SPEC_SECTIONS.find((s) => s.id === "integrations");
    const code = section.example.code;
    expect(code).toMatch(/ENV|env|KEY|_KEY/i);
  });

  it("non-goals example code is a list of exclusions", () => {
    const section = SPEC_SECTIONS.find((s) => s.id === "non-goals");
    expect(section.example.code).toContain("No ");
  });
});

/* ─── SPEC_TIPS ───────────────────────────────────────────────────────── */

describe("SPEC_TIPS", () => {
  it("exports an array", () => {
    expect(Array.isArray(SPEC_TIPS)).toBe(true);
  });

  it("contains exactly six tips", () => {
    expect(SPEC_TIPS).toHaveLength(6);
  });

  it("every tip has a non-empty id", () => {
    for (const tip of SPEC_TIPS) {
      expect(typeof tip.id).toBe("string");
      expect(tip.id.length).toBeGreaterThan(0);
    }
  });

  it("tip ids are unique", () => {
    const ids = SPEC_TIPS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every tip has a non-empty icon", () => {
    for (const tip of SPEC_TIPS) {
      expect(typeof tip.icon).toBe("string");
      expect(tip.icon.length).toBeGreaterThan(0);
    }
  });

  it("every tip has a non-empty headline", () => {
    for (const tip of SPEC_TIPS) {
      expect(typeof tip.headline).toBe("string");
      expect(tip.headline.length).toBeGreaterThan(0);
    }
  });

  it("every tip has a non-empty body", () => {
    for (const tip of SPEC_TIPS) {
      expect(typeof tip.body).toBe("string");
      expect(tip.body.length).toBeGreaterThan(0);
    }
  });

  it("tip ids follow the 'tip-*' naming convention", () => {
    for (const tip of SPEC_TIPS) {
      expect(tip.id).toMatch(/^tip-/);
    }
  });

  it("includes a tip about naming things explicitly", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-names");
    expect(found).toBeDefined();
    expect(found.body.toLowerCase()).toMatch(/name|explicit/);
  });

  it("includes a tip about types and constraints", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-types");
    expect(found).toBeDefined();
    expect(found.body.toLowerCase()).toMatch(/type|constraint/);
  });

  it("includes a tip about page behaviour", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-behaviour");
    expect(found).toBeDefined();
    expect(found.body.toLowerCase()).toMatch(/behav|page/);
  });

  it("includes a tip about error and empty states", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-errors");
    expect(found).toBeDefined();
    expect(found.body.toLowerCase()).toMatch(/error|empty/);
  });

  it("includes a tip about non-goals", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-non-goals");
    expect(found).toBeDefined();
    expect(found.body.toLowerCase()).toMatch(/non-goal|exclud/);
  });

  it("includes a tip about versioning the spec in Git", () => {
    const found = SPEC_TIPS.find((t) => t.id === "tip-version");
    expect(found).toBeDefined();
    // Body mentions Git, versioning, or committing alongside code
    expect(found.body.toLowerCase()).toMatch(/git|version|commit/);
  });

  it("no headline exceeds 80 characters", () => {
    for (const tip of SPEC_TIPS) {
      expect(tip.headline.length).toBeLessThanOrEqual(80);
    }
  });
});

/* ─── COMPILER_ARTEFACTS ─────────────────────────────────────────────── */

describe("COMPILER_ARTEFACTS", () => {
  it("exports an array", () => {
    expect(Array.isArray(COMPILER_ARTEFACTS)).toBe(true);
  });

  it("contains at least four entries", () => {
    expect(COMPILER_ARTEFACTS.length).toBeGreaterThanOrEqual(4);
  });

  it("every entry has a non-empty source field", () => {
    for (const row of COMPILER_ARTEFACTS) {
      expect(typeof row.source).toBe("string");
      expect(row.source.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty artefact field", () => {
    for (const row of COMPILER_ARTEFACTS) {
      expect(typeof row.artefact).toBe("string");
      expect(row.artefact.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty path field", () => {
    for (const row of COMPILER_ARTEFACTS) {
      expect(typeof row.path).toBe("string");
      expect(row.path.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a non-empty note field", () => {
    for (const row of COMPILER_ARTEFACTS) {
      expect(typeof row.note).toBe("string");
      expect(row.note.length).toBeGreaterThan(0);
    }
  });

  it("includes a SQL migration artefact", () => {
    const found = COMPILER_ARTEFACTS.find((r) =>
      r.artefact.toLowerCase().includes("migration")
    );
    expect(found).toBeDefined();
    expect(found.source.toLowerCase()).toContain("data model");
  });

  it("includes a Zod contracts artefact", () => {
    const found = COMPILER_ARTEFACTS.find((r) =>
      r.artefact.toLowerCase().includes("zod")
    );
    expect(found).toBeDefined();
    expect(found.path).toContain("lib/contracts");
  });

  it("includes GitHub Issues artefacts for API routes and pages", () => {
    const issueRows = COMPILER_ARTEFACTS.filter((r) =>
      r.artefact.toLowerCase().includes("github issue")
    );
    expect(issueRows.length).toBeGreaterThanOrEqual(2);

    const sources = issueRows.map((r) => r.source.toLowerCase());
    expect(sources.some((s) => s.includes("api"))).toBe(true);
    expect(sources.some((s) => s.includes("page"))).toBe(true);
  });

  it("includes an auth-related artefact", () => {
    const found = COMPILER_ARTEFACTS.find((r) =>
      r.source.toLowerCase().includes("auth")
    );
    expect(found).toBeDefined();
    expect(found.artefact.toLowerCase()).toMatch(/middleware|env/);
  });

  it("includes an integrations artefact", () => {
    const found = COMPILER_ARTEFACTS.find((r) =>
      r.source.toLowerCase().includes("integration")
    );
    expect(found).toBeDefined();
  });

  it("migration path references supabase or migrations directory", () => {
    const migration = COMPILER_ARTEFACTS.find((r) =>
      r.artefact.toLowerCase().includes("migration")
    );
    expect(migration.path.toLowerCase()).toMatch(/migration|supabase/);
  });
});
