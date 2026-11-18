// Clears Next.js's build cache before `next build`.
//
// Next.js persists fetch() results in .next/cache across builds. For this site
// that means the WordPress post list fetched by getArticleIdMap() can be reused
// from a previous build, so the article-title → post-ID mapping (and therefore
// the comments shown on each article) silently goes stale. Wiping the cache
// forces a fresh fetch on every build.
import { rmSync } from "node:fs";

rmSync(".next/cache", { recursive: true, force: true });
console.log("[build] cleared .next/cache (fresh WordPress data on every build)");
