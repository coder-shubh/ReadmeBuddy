
import { type MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";

const siteUrl = "https://readmebuddy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.publishedAt.seconds * 1000).toISOString().split("T")[0],
  }));

  const staticRoutes = [
    "",
    "/#features",
    "/#how-it-works",
    "/#generator",
    "/about",
    "/terms",
    "/privacy",
    "/posts",
    "/learn-git",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...staticRoutes, ...postRoutes];
}
