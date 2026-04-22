import type { MetadataRoute } from "next";
import { CONVERSIONS } from "../conversion-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const conversionPages: MetadataRoute.Sitemap = CONVERSIONS.map((conversion) => ({
    url: `${SITE_URL}/${conversion.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
    ...conversionPages,
  ];
}
