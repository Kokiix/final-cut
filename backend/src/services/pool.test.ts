import { describe, it, expect } from "vitest";
import { buildPool } from "./pool";

// Makes ids like ["a1", "a2", "a3"] for testing.
function makeIds(prefix: string, count: number): string[] {
  const ids: string[] = [];
  for (let i = 1; i <= count; i++) {
    ids.push(prefix + i);
  }
  return ids;
}

// Counts how many films in the pool came from one player.
function countFrom(pool: string[], prefix: string): number {
  return pool.filter((id) => id.startsWith(prefix)).length;
}

const catalog = makeIds("c", 50);

describe("buildPool", () => {
  it("returns 12 films", () => {
    const pool = buildPool([makeIds("a", 10), makeIds("b", 10)], catalog);
    expect(pool.length).toBe(12);
  });

  it("has no duplicate films", () => {
    const pool = buildPool([["x", "y", "z"], ["x", "y", "w"]], catalog);
    expect(new Set(pool).size).toBe(pool.length);
  });

  it("takes the same number of films from each player", () => {
    const pool = buildPool([makeIds("a", 10), makeIds("b", 10), makeIds("d", 10)], catalog);
    expect(countFrom(pool, "a")).toBe(4);
    expect(countFrom(pool, "b")).toBe(4);
    expect(countFrom(pool, "d")).toBe(4);
  });

  it("fills from the catalog when watchlists are small", () => {
    const pool = buildPool([["a1"], ["b1"]], catalog);
    expect(pool.length).toBe(12);
    expect(pool).toContain("a1");
    expect(pool).toContain("b1");
    expect(countFrom(pool, "c")).toBe(10);
  });

  it("works when every watchlist is empty", () => {
    const pool = buildPool([[], []], catalog);
    expect(pool.length).toBe(12);
    expect(countFrom(pool, "c")).toBe(12);
  });

  it("returns fewer than 12 if there aren't enough films", () => {
    const pool = buildPool([["a1"]], ["c1", "c2"]);
    expect(pool.length).toBe(3);
  });

  it("does not change the original watchlists", () => {
    const watchlist = ["a1", "a2", "a3"];
    buildPool([watchlist], catalog);
    expect(watchlist).toEqual(["a1", "a2", "a3"]);
  });
});
