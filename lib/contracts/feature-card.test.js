import { describe, it, expect } from "vitest";
import { FeatureCardSchema, FeatureCardListSchema } from "./feature-card.js";

const validCard = {
  id: "spec-driven",
  icon: "M9 12h3.75",
  title: "Spec-Driven",
  description: "Write a markdown spec.",
};

describe("FeatureCardSchema", () => {
  it("accepts a valid feature card", () => {
    const result = FeatureCardSchema.safeParse(validCard);
    expect(result.success).toBe(true);
  });

  it("rejects a card with a missing id", () => {
    const { id: _id, ...noId } = validCard;
    const result = FeatureCardSchema.safeParse(noId);
    expect(result.success).toBe(false);
  });

  it("rejects a card whose id is not kebab-case", () => {
    const result = FeatureCardSchema.safeParse({
      ...validCard,
      id: "Spec Driven!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a card with an empty icon", () => {
    const result = FeatureCardSchema.safeParse({ ...validCard, icon: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a title exceeding 60 characters", () => {
    const result = FeatureCardSchema.safeParse({
      ...validCard,
      title: "A".repeat(61),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a description exceeding 200 characters", () => {
    const result = FeatureCardSchema.safeParse({
      ...validCard,
      description: "D".repeat(201),
    });
    expect(result.success).toBe(false);
  });
});

describe("FeatureCardListSchema", () => {
  it("accepts a non-empty array of valid cards", () => {
    const result = FeatureCardListSchema.safeParse([validCard]);
    expect(result.success).toBe(true);
  });

  it("rejects an empty array", () => {
    const result = FeatureCardListSchema.safeParse([]);
    expect(result.success).toBe(false);
  });

  it("rejects an array containing an invalid card", () => {
    const result = FeatureCardListSchema.safeParse([{ ...validCard, id: "" }]);
    expect(result.success).toBe(false);
  });
});
