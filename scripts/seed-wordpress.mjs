// Seeds WordPress with one published post per article title.
//
// Titles come from lib/article-content.json — the same strings the site's
// lib/wordpress.ts -> getArticleIdMap() compares against, which is what makes
// comments attach to the right article.
//
// Usage:
//   DRY_RUN=1 yarn seed:wordpress   # preview only — lists what would be created
//   yarn seed:wordpress             # create any missing posts (published)
//
// Credentials (in .env, which is git-ignored):
//   WORDPRESS_API_URL=https://wordpress.thenoraedit.com.au/wp-json/wp/v2
//   WORDPRESS_USER=<wp login / email>
//   WORDPRESS_APP_PASSWORD=<application password>
//
// Generate an Application Password in WP Admin → Users → Profile →
// Application Passwords. The account needs edit_posts / publish_posts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env from the project root so the script works with a plain `node` call.
try {
  process.loadEnvFile(join(projectRoot, ".env"));
} catch {
  /* no .env — fall back to real environment variables */
}

const API_URL = (
  process.env.WORDPRESS_API_URL || "https://wordpress.thenoraedit.com.au/wp-json/wp/v2"
).replace(/\/+$/, "");
const USER = process.env.WORDPRESS_USER;
const APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;
const HAS_CREDS = Boolean(USER && APP_PASSWORD);
const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

const HEADERS = { "Content-Type": "application/json" };
if (HAS_CREDS) {
  HEADERS.Authorization = "Basic " + Buffer.from(`${USER}:${APP_PASSWORD}`).toString("base64");
}

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

if (!DRY_RUN && !HAS_CREDS) {
  fail(
    "Missing WORDPRESS_USER / WORDPRESS_APP_PASSWORD.\n" +
      "  Add them to .env (git-ignored), then re-run `yarn seed:wordpress`."
  );
}

// Mirrors decodeHtml() in lib/wordpress.ts so the duplicate check matches the app.
function decodeHtml(html) {
  return String(html || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}
const normalize = (title) => decodeHtml(title).trim();

const articleContent = JSON.parse(
  readFileSync(join(projectRoot, "lib", "article-content.json"), "utf8")
);
const titles = Object.keys(articleContent).map((key) => articleContent[key].title);

async function fetchExistingTitles() {
  const existing = new Set();
  let page = 1;
  for (;;) {
    let res;
    try {
      res = await fetch(`${API_URL}/posts?per_page=100&page=${page}&_fields=id,title`, {
        headers: HEADERS,
      });
    } catch (err) {
      if (HAS_CREDS) fail(`Could not reach WordPress: ${err.message}`);
      console.warn(`! Could not reach WordPress (${err.message}); skipping duplicate check.\n`);
      return existing;
    }
    if (!res.ok) {
      const body = await res.text();
      if (HAS_CREDS) fail(`Could not list posts (HTTP ${res.status}): ${body}`);
      console.warn(`! Could not list posts (HTTP ${res.status}); skipping duplicate check.\n`);
      return existing;
    }
    const posts = await res.json();
    for (const post of posts) existing.add(normalize(post?.title?.rendered));
    const totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    if (page >= totalPages || posts.length === 0) break;
    page++;
  }
  return existing;
}

async function createPost(title) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ title, content: "", status: "publish" }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`WordPress : ${API_URL}`);
  console.log(`User      : ${USER || "(none — dry run)"}`);
  console.log(`Mode      : ${DRY_RUN ? "DRY RUN (no writes)" : "PUBLISH"}`);
  console.log(`Titles    : ${titles.length}\n`);

  const existing = await fetchExistingTitles();
  if (existing.size) console.log(`Found ${existing.size} existing post title(s) in WordPress.\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const title of titles) {
    if (existing.has(normalize(title))) {
      console.log(`• skip     ${title}`);
      skipped++;
      continue;
    }
    if (DRY_RUN) {
      console.log(`• would create  ${title}`);
      continue;
    }
    try {
      const post = await createPost(title);
      console.log(`• created #${post.id}  ${title}`);
      console.log(`             ${post.link}`);
      created++;
    } catch (err) {
      console.error(`• FAILED   ${title}\n             ${err.message}`);
      failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 250)); // be gentle on the API
  }

  console.log(
    `\nDone. created=${created} skipped=${skipped} failed=${failed}${DRY_RUN ? " (dry run)" : ""}`
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => fail(err.stack || String(err)));
