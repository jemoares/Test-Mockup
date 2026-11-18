import { cache } from "react";
import articleContent from "@/lib/article-content.json";

export interface WpPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered:string;
  };
  content: {
    rendered: string;
  };
  link: string;
  // You can add more fields here as needed, like featured media.
}

function decodeHtml(html: string): string {
  return html
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

export const getArticleIdMap = cache(async (): Promise<Record<string, number>> => {
  try {
    // NOTE: keep this a normal (cached) fetch — `cache: "no-store"` makes the
    // route dynamic and breaks `output: "export"`. Build-time freshness is
    // handled by clearing Next's fetch cache before each build
    // (scripts/clean-next-cache.mjs via the `build` script).
    const res = await fetch(`${API_URL}/posts?per_page=100&_fields=id,title`);
    if (!res.ok) {
      console.error(await res.text());
      return {};
    }
    const posts = (await res.json()) as { id: number; title: { rendered: string } }[];

    const map: Record<string, number> = {};
    for (const key of Object.keys(articleContent)) {
      const article = articleContent[key as keyof typeof articleContent];
      const post = posts.find(
        (p) => decodeHtml(p.title.rendered).trim() === article.title.trim()
      );
      if (post) map[key] = post.id;
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch article IDs from WordPress", error);
    return {};
  }
});

const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query = "") {
  const res = await fetch(`${API_URL}/${query}`);

  if (!res.ok) {
    // Log the response for more details on the error
    console.error(await res.text());
    throw new Error("Failed to fetch API");
  }

  return res.json();
}

export async function getPosts(): Promise<WpPost[]> {
  // Assuming WORDPRESS_API_URL is set to something like "https://yoursite.com/wp-json/wp/v2"
  // we just need to query the "posts" endpoint.
  const posts = await fetchAPI("posts?_embed&per_page=10");
  return posts;
}