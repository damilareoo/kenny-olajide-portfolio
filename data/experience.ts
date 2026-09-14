/**
 * PLACEHOLDER — Kenny's role history is not yet known to this repository.
 *
 * LinkedIn answers HTTP 999 to every automated fetch, so the profile at
 * linkedin.com/in/kennyolajide could not be read. A web search surfaced
 * fragments from a ZoomInfo scrape which are NOT treated as fact and do not
 * appear here.
 *
 * These records are shaped exactly like the real thing, so replacing them is a
 * content edit and never a structural one. Delete IS_PLACEHOLDER and the
 * `placeholder` flags in the same change that supplies real rows.
 */
export const IS_PLACEHOLDER = true;

export type Role = {
  role: string;
  company: string;
  from: string;
  to: string;
  placeholder: boolean;
};

export const roles: Role[] = [
  { role: "Product Designer", company: "Company", from: "2024", to: "Present", placeholder: true },
  { role: "Product Designer", company: "Company", from: "2022", to: "2024", placeholder: true },
  { role: "Designer", company: "Company", from: "2021", to: "2022", placeholder: true },
];
