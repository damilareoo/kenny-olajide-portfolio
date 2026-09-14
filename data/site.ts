export const site = {
  name: "Kenny Olajide",
  role: "Product Designer",
  headline: "Product Designer, Content Editor, Writer, Chess lover",
  education: "University of Ibadan",
  location: "Nigeria",
  url: "https://kennyolajide.com",
  email: "hello@kennyolajide.com",
  linkedin: "https://linkedin.com/in/kennyolajide",
};

/* Only links that are known to exist. A portfolio that lists an empty profile
   is worse than one that lists none. */
export const elsewhere = [
  { label: "LinkedIn", handle: "kennyolajide", href: site.linkedin },
  { label: "Email", handle: site.email, href: `mailto:${site.email}` },
];
