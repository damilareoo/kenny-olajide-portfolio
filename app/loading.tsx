/* Deliberately quiet. The boot screen is the site's entrance; a second
   animated screen on every route change would compete with it. */
export default function Loading() {
  return <div className="min-h-[60svh]" aria-busy="true" />;
}
