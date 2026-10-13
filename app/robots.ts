import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vyparx.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services", "/industries", "/how-it-works", "/case-studies", "/about", "/contact"],
      disallow: ["/admin/", "/client/", "/business/", "/api/"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
