import { describe, expect, it } from "vitest";
import { elsewhere, site } from "./site";

describe("site record", () => {
  /* The brief's LinkedIn URL, /in/kennyolajide, 301s to LinkedIn's own 404 —
     it is not his profile. Linking a designer's portfolio at a dead version of
     his own profile is the kind of error nobody tests for and everybody sees. */
  it("points at Kenny's real LinkedIn vanity URL", () => {
    expect(site.linkedin).toContain("kenny-olajide-b5476216a");
    expect(site.linkedin).not.toMatch(/in\/kennyolajide\b/);
  });

  it("gives every elsewhere entry a real destination", () => {
    expect(elsewhere.length).toBeGreaterThan(0);
    for (const e of elsewhere) {
      expect(e.href, `${e.label} has no href`).toBeTruthy();
      expect(e.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});
