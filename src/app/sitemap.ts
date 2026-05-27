import { MetadataRoute } from "next";

const towns = [
  { slug: "pretoria", name: "Pretoria" },
  { slug: "johannesburg", name: "Johannesburg" },
  { slug: "cape-town", name: "Cape Town" },
  { slug: "durban", name: "Durban" },
  { slug: "centurion", name: "Centurion" },
  { slug: "sandton", name: "Sandton" },
  { slug: "randburg", name: "Randburg" },
  { slug: "midrand", name: "Midrand" },
  { slug: "roodepoort", name: "Roodepoort" },
  { slug: "germiston", name: "Germiston" },
  { slug: "benoni", name: "Benoni" },
  { slug: "boksburg", name: "Boksburg" },
  { slug: "springs", name: "Springs" },
  { slug: "alberton", name: "Alberton" },
  { slug: "vereeniging", name: "Vereeniging" },
  { slug: "vanderbijlpark", name: "Vanderbijlpark" },
  { slug: "bloemfontein", name: "Bloemfontein" },
  { slug: "pietermaritzburg", name: "Pietermaritzburg" },
  { slug: "port-elizabeth", name: "Port Elizabeth" },
  { slug: "east-london", name: "East London" },
];

const slugs = ["ed-supplement", "libido-enhancer"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://malevitamin.co.za";

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ed-supplement`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testosterone-booster`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stamina-supplement`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/libido-enhancer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/male-performance`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Town-based SEO pages
  const townPages: MetadataRoute.Sitemap = towns.flatMap((town) =>
    slugs.map((slug) => ({
      url: `${baseUrl}/${town.slug}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...mainPages, ...townPages];
}
