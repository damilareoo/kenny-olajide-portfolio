import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import sitemap from "./sitemap";
import robots from "./robots";
import manifest from "./manifest";

describe("metadata", () => {
  it("lists every real route in the sitemap, and only those", () => {
    // Three routes, and no others — §1 of the v3 spec. /work and /writing are
    // gone; a sitemap that still named them would send crawlers at 404s.
    const urls = sitemap().map((e) => new URL(e.url).pathname).sort();
    expect(urls).toEqual(["/", "/about", "/shots"]);
  });

  it("keeps the artwork proxy out of the crawl — it is plumbing", () => {
    expect(robots().rules).toMatchObject({ userAgent: "*", disallow: "/api/" });
  });

  it("names the app and takes its colours from the light ground", () => {
    // --bg, read off app/globals.css. The old theme colour (#090909) belonged
    // to the removed dark skin; an installed app must open onto the light
    // ground like every other surface.
    expect(manifest().name).toBe("Kenny Olajide");
    expect(manifest().background_color).toBe("#fcfcfc");
    expect(manifest().theme_color).toBe("#fcfcfc");
  });

  it("ships one share image for every platform, at the universal size", () => {
    /* Every scraper — iMessage, WhatsApp, Telegram, Slack, Discord, X,
       Facebook, LinkedIn — reads og:image, and Twitter falls back to it, so
       one absolute 1200x630 JPEG covers all of them. A generated route would
       also work, but the owner supplied the art: the file is the card. */
    expect(existsSync("public/og.jpg"), "public/og.jpg is committed").toBe(true);
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain('url: "/og.jpg"');
    expect(layout).toContain("width: 1200");
    expect(layout).toContain("height: 630");
    expect(layout).toContain('card: "summary_large_image"');
    expect(layout).toContain('images: ["/og.jpg"]');
  });

  it("holds the browser-chrome colour to the stylesheet's own ground", () => {
    /* app/layout.tsx writes --bg into `viewport.themeColor` by hand, because
       a CSS custom property cannot be read from a Next metadata export. That
       is one literal that can drift from the stylesheet, so this reads the
       file and compares it. Singular now: one skin, one chrome colour. */
    const css = readFileSync("app/globals.css", "utf8");
    const layout = readFileSync("app/layout.tsx", "utf8");
    const bg = css.match(/:root\s*\{[^}]*?--bg:\s*(#[0-9a-f]{6})/s)![1];

    expect(layout).toContain(`themeColor: "${bg}"`);
    expect(layout).not.toMatch(/prefers-color-scheme/);
  });
});

describe("page titles", () => {
  /* The template in app/layout.tsx already appends " — Kenny Olajide". A page
     whose own title also ends in the name renders it twice —
     "About — Kenny Olajide — Kenny Olajide" — which is the first thing a browser
     tab, a search result and a link unfurl show. This shipped once; the
     assertion is here so it cannot ship again. */
  const routes = ["app/about/page.tsx", "app/shots/page.tsx", "app/not-found.tsx"];

  it("never repeats the site name in a page title", () => {
    for (const route of routes) {
      const src = readFileSync(route, "utf8");
      const titles = [...src.matchAll(/title:\s*([^,\n}]+)/g)].map((m) => m[1]);
      for (const t of titles) {
        expect(t, `${route} repeats the site name in its title`).not.toMatch(/Kenny Olajide/);
      }
    }
  });

  it("keeps the template that supplies the name exactly once", () => {
    expect(readFileSync("app/layout.tsx", "utf8")).toMatch(/template:\s*`%s — \$\{site\.name\}`/);
  });
});

describe("light-only", () => {
  /* The design has one skin. These hold the seams a dark mode could come
     back through: the provider that detects the system, the stylesheet block
     that repaints it, and the declarations that keep native surfaces light. */
  it("forces the theme provider to light and detects nothing", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain('forcedTheme="light"');
    expect(layout).not.toMatch(/defaultTheme="system"/);
    expect(layout).not.toMatch(/enableSystem(?=={true}|\s|>)/);
    expect(layout).not.toMatch(/disableTransitionOnChange/);
  });

  it("declares a light color scheme and keeps no dark machinery", () => {
    const css = readFileSync("app/globals.css", "utf8");
    expect(css).toMatch(/:root\s*\{[^}]*?color-scheme:\s*light/s);
    expect(css).not.toMatch(/^\.dark\s*\{/m);
    expect(css).not.toMatch(/prefers-color-scheme/);
    expect(css).not.toMatch(/@custom-variant dark/);
  });

  it("declares the scheme in the document head", () => {
    const layout = readFileSync("app/layout.tsx", "utf8");
    expect(layout).toMatch(/colorScheme:\s*"light"/);
  });

  it("keeps no dark utility classes on any rendered surface", () => {
    /* Belt and braces beside the stylesheet assertions: a `dark:` class with
       no variant and no skin is inert, but it is also a promise to nobody. */
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
          walk(path);
        } else if (name.endsWith(".tsx") && !name.endsWith(".test.tsx")) {
          const src = readFileSync(path, "utf8");
          for (const [match] of src.matchAll(/dark:[a-z-]+/g)) {
            offenders.push(`${path}: ${match}`);
          }
        }
      }
    };
    for (const dir of ["app", "components", "lib", "data"]) walk(dir);
    expect(offenders).toEqual([]);
  });
});
