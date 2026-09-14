import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { generateStaticParams } from "./[slug]/page";

describe("the writing route", () => {
  it("declares every post slug", async () => {
    expect((await generateStaticParams()).map((p) => p.slug).sort())
      .toEqual(["designing-for-live", "on-constraint"]);
  });

  it("carries the same dynamicParams fix as the case route", () => {
    // Same trap: it sits behind app/loading.tsx.
    expect(readFileSync("app/writing/[slug]/page.tsx", "utf8"))
      .toMatch(/export const dynamicParams = false/);
  });
});
