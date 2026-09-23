import type { NextConfig } from "next";

/* No `remotePatterns`, on purpose. Nothing external is optimised directly;
   Apple's artwork comes through /api/app-store/art instead. Widening this
   would hand every future component permission to load from mzstatic.com. */
const nextConfig: NextConfig = {
  images: {
    /* Case-study art renders at quality 90 through `components/frame.tsx`;
       the feed stays at the default. Next 15+ answers 400 to any quality not
       named here, so both numbers the site actually asks for are listed. */
    qualities: [75, 90],
  },
};

export default nextConfig;
