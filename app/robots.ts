import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Each /search request is a full table scan in Supabase, so keep bots out.
      disallow: ["/admin/", "/api/", "/search"],
    },
    sitemap: "https://sweardictionary.com/sitemap.xml",
  };
}
