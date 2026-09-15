import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { EasterEgg } from "@/components/easter-egg";
import { site } from "@/data/site";
import "./globals.css";

/**
 * The one deliberate divergence from the source design language.
 *
 * `/Users/v/portfolio-v2` is set in Suisse Int'l, a commercial face from Swiss
 * Typefaces licensed per site. Copying its six woff2 files into a second public
 * repository on a different domain would very likely exceed whatever licence
 * covers damilareoo.xyz, so the binaries are not here.
 *
 * Geist and Geist Mono stand in — a neo-grotesque with proportions close to
 * Suisse, free under the SIL Open Font Licence, self-hosted by `next/font` at
 * build time so nothing is fetched from Google at runtime.
 *
 * The CSS variable names are the source's own, unchanged, and that is the
 * point: `app/globals.css` reads `--font-suisse` and `--font-suisse-mono` and
 * nothing downstream of this file knows which face is bound to them. Restoring
 * Suisse is a change to these two declarations and nothing else.
 *
 * One number is worth knowing rather than assuming. `components/company-marks.tsx`
 * sets every company mark to a cap height of 0.725em, which was read off Suisse
 * Int'l's own OS/2 table. Geist's cap height is 0.7 of its em — close enough
 * that the marks still sit on the line, and off by enough that it is recorded
 * here rather than discovered later.
 */
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-suisse",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-suisse-mono",
  display: "swap",
});

/* site.url (data/site.ts) is the owner's best guess at the eventual domain,
   not a confirmed one — read from there rather than hardcoded here so a
   single edit fixes every surface if it turns out to be wrong. */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: "Product designer working on chess software.",
  openGraph: { type: "website", siteName: site.name, url: site.url },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    /* --bg on each skin, or the browser chrome sits a shade off the page it
       is framing. Held to app/globals.css by hand: a retune that moves --bg
       moves these two. */
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#090909" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* Inside ThemeProvider so the board is drawn in whichever theme is
              on. Last in the tree because it is the last thing that should
              ever take focus, and it takes none until someone types e4. */}
          <EasterEgg />
        </ThemeProvider>
      </body>
    </html>
  );
}
