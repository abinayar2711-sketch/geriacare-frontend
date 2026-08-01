import type { MetadataRoute } from "next";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db, posts } from "@/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.geriacare.in";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db
    .select({
      id: posts.id,
      type: posts.type,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.status, "live"),
        inArray(posts.type, ["question", "article"]),
      ),
    )
    .orderBy(desc(posts.createdAt));

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/landing`, priority: 0.9 },
    { url: `${BASE}/feed`, priority: 0.9 },
    { url: `${BASE}/articles`, priority: 0.8 },
    { url: `${BASE}/ask`, priority: 0.8 },
    { url: `${BASE}/about`, priority: 0.7 },
    { url: `${BASE}/contact`, priority: 0.7 },
    { url: `${BASE}/signin`, priority: 0.5 },
  ];

  const contentPages: MetadataRoute.Sitemap = rows.map((r) => ({
    url: `${BASE}/post/${r.id}`,
    lastModified: r.createdAt,
    priority: 0.7,
  }));

  return [...staticPages, ...contentPages];
}
