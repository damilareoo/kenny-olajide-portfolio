export const site = {
  name: "Kenny Olajide",
  role: "Product Designer",
  headline: "Product Designer, Content Editor, Writer, Chess lover",
  education: "University of Ibadan",
  location: "Nigeria",
  url: "https://kennyolajide.com",
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
