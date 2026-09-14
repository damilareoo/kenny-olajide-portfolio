import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { generateStaticParams } from "./[slug]/page";

describe("the case route", () => {
  it("declares every slug it will serve", async () => {
    expect((await generateStaticParams()).map((p) => p.slug).sort())
      .toEqual(["chessever", "endgame-ai"]);
  });

  it("sets dynamicParams=false so an unknown slug is a real 404", () => {
    /* The case page sits behind app/loading.tsx, so Next serves a prerendered
       shell and commits HTTP 200 before the body streams — a notFound()
       reached during render can never set the status, and the page soft-404s.
       Moving the decision to the router is the fix. portfolio-v2 shipped this
       bug and fixed it exactly here; do not remove this line. */
    const src = readFileSync("app/work/[slug]/page.tsx", "utf8");
    expect(src).toMatch(/export const dynamicParams = false/);
  });
});
