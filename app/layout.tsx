import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { BootScreen } from "@/components/boot-screen";
import { EasterEgg } from "@/components/easter-egg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkipLink } from "@/components/skip-link";
import { site } from "@/data/site";
import "./globals.css";

/* next/font self-hosts this at build time — no request to Google at runtime,
   and no layout shift from a swap. `variable` rather than `className` so the
   family is reachable as a token from CSS alongside the colour tokens. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <SkipLink />
        <BootScreen />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          {children}
          <SiteFooter />
          {/* Inside ThemeProvider so the board is drawn in whichever theme is
              on. Last in the tree because it is the last thing that should
              ever take focus, and it takes none until someone types e4. */}
          <EasterEgg />
        </ThemeProvider>
      </body>
    </html>
  );
}
