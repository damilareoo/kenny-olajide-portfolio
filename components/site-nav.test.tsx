// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteNav } from "@/components/site-nav";

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
  document.body.style.overflow = "";
});
const render = (ui: React.ReactElement) => act(() => root.render(ui));
const menu = () => host.querySelector('[role="dialog"]')!;
const openMenu = () =>
  act(() => {
    host
      .querySelector('button[aria-controls="site-menu"]')!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

describe("SiteNav", () => {
  it("shares one header row: name left, menu control right", () => {
    render(<SiteNav current="/shots" />);
    const bar = host.querySelector("div.sticky")!;
    const row = bar.firstElementChild!;
    expect(row.className).toContain("justify-between");
    const name = bar.querySelector('a[aria-label="Kenny Olajide — home"]')!;
    const menu = bar.querySelector('button[aria-controls="site-menu"]')!;
    expect(name.compareDocumentPosition(menu) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    openMenu();
    expect(host.querySelector('[aria-current="page"]')!.textContent).toContain("Shots");
  });

  it("renders the lockup as the page h1 on home, once", () => {
    render(<SiteNav current="/" />);
    const h1s = host.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toContain("Kenny Olajide");
  });

  it("opens the menu on control and lists every route", () => {
    render(<SiteNav current="/" />);
    expect(menu().getAttribute("data-open")).toBeNull();
    openMenu();
    expect(menu().getAttribute("data-open")).toBe("true");
    for (const label of ["Home", "Shots", "About"]) {
      expect(menu().textContent).toContain(label);
    }
  });

  it("closes on the close control and on Escape", () => {
    render(<SiteNav current="/" />);
    openMenu();
    act(() => {
      menu()
        .querySelector('button[aria-label="Close menu"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(menu().getAttribute("data-open")).toBeNull();

    openMenu();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(menu().getAttribute("data-open")).toBeNull();
  });

  it("locks the body scroll while open and frees it after", () => {
    render(<SiteNav current="/" />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      menu()
        .querySelector('button[aria-label="Close menu"]')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("carries a way out by mail inside the menu", () => {
    render(<SiteNav current="/" />);
    openMenu();
    const mail = menu().querySelector('a[href^="mailto:"]')!;
    expect(mail.textContent).toContain("@");
  });
});
