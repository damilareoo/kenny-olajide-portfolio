export const site = {
  name: "Kenny Olajide",
  role: "Product Designer",
  headline: "Product Designer, Content Editor, Writer, Chess lover",
  education: "University of Ibadan",
  location: "Nigeria",
  /* Where the site actually is, and it has to be the live one: every absolute
     URL the site emits — og:image, twitter:image, the canonical, the sitemap's
     rows, robots' sitemap line — is resolved against this. It was
     "https://kennyolajide.com", which was the eventual domain somebody hoped
     for rather than one that exists: it does not resolve (no DNS, checked
     2026-09-17), so every link preview pointed at a dead host and no scraper
     could fetch the share card.

     When the custom domain is bought and pointed at the deployment, this is the
     one line that changes. `data/site.test.ts` holds it to a host that answers
     so the same mistake cannot land twice. */
  url: "https://kenny-olajide-portfolio.vercel.app",
  email: "hello@kennyolajide.com",
  /* The real vanity URL. "/in/kennyolajide" — the one in the original brief —
     301s to LinkedIn's own 404 page; it is not his profile and never was.
     Verified in a browser on 2026-09-14, which is also where his role history
     was read from. */
  linkedin: "https://www.linkedin.com/in/kenny-olajide-b5476216a/",
};

/* Only links that are known to exist. A portfolio that lists an empty profile
   is worse than one that lists none. */
export const elsewhere = [
  { label: "LinkedIn", handle: "kenny-olajide", href: site.linkedin },
  { label: "Email", handle: site.email, href: `mailto:${site.email}` },
];
