// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/data/site";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});
const render = (ui: React.ReactElement) => act(() => root.render(ui));

describe("SiteFooter", () => {
  it("opens the same contact door as the about ending", () => {
    render(<SiteFooter />);
    expect(host.textContent).toContain("Have a role or a collaboration in mind?");
    expect(host.textContent).toContain("Message me");
  });

  it("keeps the one contact path: the mail row with a copy control", () => {
    render(<SiteFooter />);
    /* Two mailto links now — the contact door and the mail row. The row is
       the one that prints the address. */
    const mail = [...host.querySelectorAll(`a[href="mailto:${site.email}"]`)].find(
      (a) => a.textContent?.includes(site.email),
    )!;
    expect(mail.textContent).toContain(site.email);
    expect(host.querySelector("button")).not.toBeNull();
  });

  it("mounts somebody else's player lazily, in our frame", () => {
    render(<SiteFooter />);
    const frame = host.querySelector("iframe")!;
    expect(frame.getAttribute("src")).toMatch(/^https:\/\/open\.spotify\.com\/embed\//);
    expect(frame.getAttribute("loading")).toBe("lazy");
    expect(frame.getAttribute("title")).toBeTruthy();
    /* The mount, not the player, carries the site's shape. */
    expect(frame.parentElement!.className).toMatch(/border-line/);
    const out = host.querySelector('a[href^="https://open.spotify.com/playlist/"]')!;
    expect(out.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
