import { describe, it, expect } from "vitest";
import { features } from "./features.js";

describe("features data", () => {
  it("exports exactly three feature cards", () => {
    expect(features).toHaveLength(3);
  });

  it("every card has a non-empty id, icon, title, and description", () => {
    for (const card of features) {
      expect(card.id).toBeTruthy();
      expect(card.icon).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.description).toBeTruthy();
    }
  });

  it("ids are unique", () => {
    const ids = features.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains the three spec-defined features", () => {
    const ids = features.map((c) => c.id);
    expect(ids).toContain("spec-driven");
    expect(ids).toContain("parallel-agents");
    expect(ids).toContain("holdout-verification");
  });

  it("each title does not exceed 60 characters", () => {
    for (const card of features) {
      expect(card.title.length).toBeLessThanOrEqual(60);
    }
  });

  it("each description does not exceed 200 characters", () => {
    for (const card of features) {
      expect(card.description.length).toBeLessThanOrEqual(200);
    }
  });
});
