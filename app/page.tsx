import { FooterLine } from "@/components/footer-line";
import { SiteNav } from "@/components/site-nav";

/**
 * Stage A placeholder.
 *
 * The design language landed in this commit; the home's own shape — the
 * lockup, the claim, the record as a running sentence with company marks set
 * inline, and the work numbered — is Stage B's work and is specified in §3 of
 * docs/superpowers/specs/2026-09-15-v3-design-language-switch.md.
 *
 * What is here is the chrome that is already finished, so the route compiles,
 * renders and can be looked at while the page is built on top of it.
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 py-4 sm:px-6">
      <SiteNav current="/" />
      <div className="flex-1" />
      <div className="mt-16">
        <FooterLine />
      </div>
    </main>
  );
}
