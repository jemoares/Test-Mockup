# The NORA Edit — Website Maintenance Guide

This is the handoff guide for maintaining **The NORA Edit** website
(`thenoraedit.com.au`). It covers how the project is built, which files you edit
to publish or update articles, what each part of the codebase does, and how the
site is deployed.

It is built with **Next.js 14 (App Router)** and exported as a **static site**
(`out/`) that is uploaded to **cPanel** hosting. All content is authored on a
**1440px Figma canvas** and rendered proportionally (see
[Layout & design system](#6-layout--design-system)).

---

## Table of contents

1. [Tech stack](#1-tech-stack)
2. [Installation & local development](#2-installation--local-development)
3. [Project structure](#3-project-structure)
4. [Main components](#4-main-components)
5. [Updating articles](#5-updating-articles-the-common-task)
6. [Layout & design system](#6-layout--design-system)
7. [Build & deploy (cPanel zip workflow)](#7-build--deploy-cpanel-zip-workflow)
8. [Troubleshooting](#8-troubleshooting)
9. [Future recommendation: article bodies in WordPress](#9-future-recommendation-article-bodies-in-wordpress)

---

## 1. Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js `14.2.5`, App Router, **static export** (`output: 'export'`) |
| Language | TypeScript + React 18 |
| Styling | Inline styles + `app/globals.css` (no CSS framework) |
| Animation | `framer-motion` |
| Dates | `luxon` |
| Content | Local JSON (`lib/article-content.json`) + WordPress REST API (comments & post IDs) |
| Fonts | Adobe Typekit (ivypresto-display) + Google Fonts, loaded in `app/layout.tsx` |
| Analytics | Google Analytics (`gtag`) in `app/layout.tsx` |
| Hosting | cPanel (static files extracted into the document root) |

> **Static export:** there is no Node server in production. `next build` writes a
> complete static site to `out/`, which is what gets deployed. Anything that must
> run at request time (comments, comment counts, forms) talks to third-party
> services (WordPress REST API, Monday.com) directly from the browser.

---

## 2. Installation & local development

### Prerequisites

- **Node.js 18+** (developed on v24)
- **Yarn 1.x** (the repo ships a `yarn.lock`; use `yarn`, not `npm`)

### Setup

```bash
# 1. Install dependencies
yarn install

# 2. Create your local environment file from the committed sample
#    (.env is git-ignored, .env.example is the template)
cp .env.example .env        # Windows: copy .env.example .env

# 3. Start the dev server
yarn dev            # http://localhost:3000
```

### Environment variables

**`.env.example`** is committed as the template. Copy it to **`.env`**
(git-ignored) and fill in the values:

```dotenv
WORDPRESS_API_URL=https://wordpress.thenoraedit.com.au/wp-json/wp/v2
NEXT_PUBLIC_BASE_PATH=
WORDPRESS_USER=you@example.com
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

| Variable | Purpose |
| --- | --- |
| `WORDPRESS_API_URL` | WordPress REST base URL. Used **at build time** (server-side) to map article titles to WordPress post IDs, which lets the correct comments load on each article page. |
| `NEXT_PUBLIC_BASE_PATH` | Only set this if the site is served from a **sub-folder** (e.g. `/nora`). Leave **empty** when the site is at a domain root (the current cPanel setup). It feeds `basePath`/`assetPrefix` in `next.config.mjs` and the `asset()` helper. |
| `WORDPRESS_USER` | WordPress login/email — only needed by `yarn seed:wordpress`. |
| `WORDPRESS_APP_PASSWORD` | WordPress Application Password — only needed by `yarn seed:wordpress`. |

> ⚠️ `WORDPRESS_API_URL` matters at **build time**, not runtime. If it is missing
> or wrong when you run `yarn build`, article pages will build without their
> WordPress post IDs and comments may not appear.

### Useful commands

| Command | Does |
| --- | --- |
| `yarn dev` | Local dev server with hot reload |
| `yarn build` | Clears Next's fetch cache, then static-exports to `out/` (the deployable site) |
| `yarn deploy` | Alias for `yarn build` — prepares `out/` for deployment |
| `yarn seed:wordpress` | Bulk-creates the WordPress posts from the article titles |
| `yarn lint` | Next.js ESLint |

---

## 3. Project structure

```
nora-edit-website/
├─ app/                        # Routes (App Router)
│  ├─ layout.tsx               # Global <head> (fonts, favicons, GA) + Footer + ScrollBadge
│  ├─ page.tsx                 # Home page (one long scroll)
│  ├─ globals.css              # Reset, design tokens, root-font-size scaler, font classes
│  ├─ article/[slug]/page.tsx  # Article pages — ARTICLES registry + render
│  ├─ channel/[slug]/page.tsx  # Channel listing pages
│  ├─ get-in-touch/page.tsx    # Contact / contribute page
│  └─ get-in-touch-copy/…      # Duplicate of the above (kept for reference)
│
├─ components/                 # UI building blocks (see §4)
│  └─ article/                 # Article-specific: Hero, Body, Conversation, Footer, anim
│
├─ lib/
│  ├─ article-content.json     # ⭐ ALL article copy (18 articles)
│  ├─ constants.ts             # ⭐ Channel + article-card listings, Monday form URL
│  ├─ wordpress.ts             # WordPress API helpers (post IDs, posts)
│  ├─ px.ts                    # Design tokens: r(), COLORS, BANDS, canvas sizes
│  ├─ asset.ts                 # asset() → prefixes /assets paths with basePath
│  ├─ app.store.ts             # Tiny global store (darkMode flag)
│  ├─ useBackLabel.ts          # "Back to …" label logic
│  └─ tools.ts                 # slugify()
│
├─ public/assets/              # ⭐ ALL images, videos, gifs, svg icons
│
├─ scripts/
│  ├─ clean-next-cache.mjs     # wipes Next's build cache before every build
│  └─ seed-wordpress.mjs       # bulk-creates WordPress posts from article titles
│
├─ next.config.mjs             # output:'export', trailingSlash, basePath
├─ vercel.json                 # LEGACY — no longer used (Vercel deploy removed)
├─ .env.example                # Committed env template (copy to `.env`)
└─ .env / .env.local           # Local secrets (git-ignored)
```

**Files that matter most for content:** `lib/article-content.json`,
`app/article/[slug]/page.tsx`, `lib/constants.ts`, and `public/assets/`.

---

## 4. Main components

### Home page

| Component | Role |
| --- | --- |
| `components/IntroSplash.tsx` | Opening splash animation |
| `components/Hero.tsx` | Dark hero (TV scene) |
| `components/SectionTwo.tsx` | Dark full-bleed section (phones / portrait) |
| `components/ChannelsIntro.tsx` | `ChannelsIntro` + `ChannelSeparator` (torn-paper seam) |
| `components/CreamBlock.tsx` | `CreamBackdrop`, `IntroBlock`, **`ChannelsPinned`** (sticky horizontal card scrub), **`EditorialSection`** (the article-card galleries) |
| `components/Carousel.tsx` | Horizontal scroll track used by the pinned channel cards |
| `components/Nav.tsx` | Top navigation; `NAV_LINKS` derived from `CHANNELS` |
| `components/Footer.tsx` | Navy footer + newsletter popup (Monday form) |

### Shared / utility

| Component | Role |
| --- | --- |
| `components/Media.tsx` | `VideoBg` — muted looping background video |
| `components/bits.tsx` | `Arrow`, `ReadLink`, `Accent`, `AccentGIF` |
| `components/anim.tsx` | `FadeUp`, `ScrollReveal`, `ScrollLetters`, `ScrollBadge`, `FadeIn` |
| `components/useIsMobile.ts` | `useIsMobile(768)` breakpoint hook |
| `components/useOnClickOutside.ts` | Outside-click hook (menus) |

### Article pages (`components/article/`)

| Component | Role |
| --- | --- |
| `Hero.tsx` | `Hero` — article header (headline, subtitle, byline, meta, hero image/portrait) |
| `Body.tsx` | Renders `sections[]` from `article-content.json` (paragraphs, headings, quotes, images, lists) |
| `Conversation.tsx` | **Comments (WordPress API)**, related articles, share buttons, subscribe |
| `Footer.tsx` | Article footer |
| `anim.tsx` | `Band`, `Reveal`, `RevealImg`, `Parallax`, `DrawLine`, `ScrollBadge` |

### `lib/` helpers

| File | Role |
| --- | --- |
| `px.ts` | `r(px)` converts Figma px → rem; `COLORS`, `BANDS`, `fullBleed`, `gridInner`, canvas heights |
| `asset.ts` | `asset("/assets/x.jpg")` prefixes the optional `basePath` |
| `wordpress.ts` | `getArticleIdMap()` (title → WP post ID), `getPosts()` |
| `app.store.ts` | Minimal global store (`darkMode`) |
| `useBackLabel.ts` | Resolves the "Back to …" label from the previous route/channel |

---

## 5. Updating articles (the common task)

Publishing or editing an article touches **three files** plus the assets folder.
Each article has:

- a **`contentKey`** (an entry in `lib/article-content.json`), and
- a **`slug`** (its URL and its entry in the `ARTICLES` registry).

### Step 1 — Write the article content

Edit **`lib/article-content.json`**. Each article is a top-level key
(`article1` … `article18`):

```jsonc
{
  "article16": {
    "title": "Bridging worlds to thrive",      // must match the WordPress post title (comments)
    "hero": {
      "category": "RETAIL &middot; STRATEGY",  // HTML entities allowed
      "headline": "Bridging worlds to thrive",
      "subtitle": "&quot;Purpose … essential.&quot;",
      "byline": "By Jeremy Meltzer, founder & CEO, i=Change",
      "meta": "21 AUGUST 2026  •  5 MIN READ",
      "heroImage": "Featured-POV-hero.jpg",     // filename in public/assets
      "portrait": "jeremy-meltzer.png"          // optional circular portrait
    },
    "sections": [
      { "type": "paragraph", "content": "Body copy…", "dropCap": "T" },
      { "type": "heading", "level": 3, "marker": "marker-1.svg", "content": "A heading" },
      { "type": "image", "src": "related-1.jpg", "alt": "", "parallaxRange": 24 },
      { "type": "quote", "content": "“Pull quote…”", "attribution": "— Name" },
      { "type": "list", "title": "Optional intro", "items": ["<strong>Item</strong>", "Item"] }
    ]
  }
}
```

**Section types** (`type`):

| `type` | Fields |
| --- | --- |
| `paragraph` | `content` (HTML allowed), optional `dropCap` (single letter) |
| `heading` | `content`, optional `level`, optional `marker` (svg filename) |
| `image` | `src`, `alt`, optional `parallaxRange`, optional `quote` |
| `quote` | `content` (HTML allowed), optional `attribution` |
| `list` | `title` (optional), `items[]` (HTML allowed) |

> Inline HTML (`<strong>`, `<em>`, `&mdash;`, `&quot;`, …) is supported in
> `content`, `title`, `headline`, `subtitle`, and list items because they are
> rendered with `dangerouslySetInnerHTML`.

### Step 2 — Register the route

Edit **`app/article/[slug]/page.tsx`** and add an entry to `ARTICLES`:

```ts
{ slug: "bridging-worlds-to-thrive", title: "Bridging worlds to thrive", contentKey: "article16" }
```

- `slug` → the URL: `/article/bridging-worlds-to-thrive/`
- `contentKey` → the JSON key from Step 1
- `title` is optional; it is only used where a page title is needed

> This array also drives `generateStaticParams()`, i.e. **only slugs listed here
> are built**. A new article will 404 until it is added.

### Step 3 — Add the article card(s) to the listings

Edit **`lib/constants.ts`** and add a card to the relevant gallery array:

- `EDITORIAL_ARTICLES` → home "This month's consequential insights"
- `EDITORIAL_ARTICLES_1` → "In collaboration" channel
- `EDITORIAL_ARTICLES_INTELLIGENCE` → "The intelligence unit" channel

```ts
{
  kind: "wide",                    // "tall" (portrait) | "wide" (landscape)
  left: 0, top: 0,                 // layout placeholders; ignored by the gallery
  title: "Bridging worlds to thrive",
  blurb: "Short description shown on the card.",
  caption: "Industry Perspectives",   // optional small label
  href: "/article/bridging-worlds-to-thrive/",
  image: "Bridging-Worlds-That-Thrive-Tile.jpg",
  author: "Jeremy Meltzer, founder & CEO, i=Change",
  date: "2026-08-21T00:00:00Z",
  textColor: "black"               // optional, overrides white text
}
```

Related-article cards at the bottom of every article come from
`EDITORIAL_ARTICLES` (random) or `FEATURED_RELATED` inside
`components/article/Conversation.tsx` for the two `limitRelated` articles
(`article17`, `article18`).

### Step 4 — Add images / media

Drop every referenced file (images, `.mp4`/`.webm`, `.gif`, `.svg`) into
**`public/assets/`**. Reference them by **filename only** (e.g. `"my-image.jpg"`),
never with a path — the `asset()` helper resolves them at build time.

### Step 5 — Build

```bash
yarn build      # rebuilds out/
```

### WordPress title matching (important)

Comments are stored in WordPress, and the site matches an article's JSON
`title` to a WordPress **post title** (`lib/wordpress.ts` → `getArticleIdMap`).
For comments to appear:

1. the JSON `title` and the WordPress post title must match **exactly**
   (after HTML-entity decoding and trimming), and
2. `WORDPRESS_API_URL` must be set at build time.

The title → post-ID map is resolved **at build time** (there is no server at
runtime), so after adding or renaming WordPress posts you must rebuild for
comments to line up. `yarn build` clears Next.js's fetch cache first — otherwise
Next reuses the post list from the previous build and the mapping silently goes
stale.

### Bulk-creating the WordPress posts

The post titles above need to exist in WordPress — that is what comments attach
to. A one-off helper seeds them:

```bash
DRY_RUN=1 yarn seed:wordpress   # preview the 18 titles, no writes
yarn seed:wordpress             # create any missing posts (published)
```

`scripts/seed-wordpress.mjs` reads the titles from `lib/article-content.json`
(the strings the site matches on), skips titles that already exist, and creates
the rest via the WordPress REST API with the **title only** (no content). It
needs credentials in `.env`:

```dotenv
WORDPRESS_USER=you@example.com
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

Generate the application password in **WP Admin → Users → Profile →
Application Passwords**; the account needs `edit_posts` / `publish_posts`. It is
safe to re-run.

### WordPress CORS for comments (server-side config)

The "Join the Conversation" block fetches and posts comments **cross-origin**
from `thenoraedit.com.au` to `wordpress.thenoraedit.com.au`
(`components/article/Conversation.tsx`). Unless WordPress returns CORS headers
allowing the marketing site's origin, the browser blocks those requests.

- Endpoints: `GET` / `POST https://wordpress.thenoraedit.com.au/wp-json/wp/v2/comments`
- The `GET` is a *simple* request; the `POST` (sent as `Content-Type: application/json`)
  triggers an `OPTIONS` **preflight**, so the preflight must also be allowed.

The WordPress site must return, for `https://thenoraedit.com.au` (and
`https://www.thenoraedit.com.au`):

- `Access-Control-Allow-Origin: <that origin>` — **exactly one** such header
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

This is configured **on the WordPress server, not in this repo**. Put it in a
theme `functions.php`, or preferably an **mu-plugin**
(`wp-content/mu-plugins/cors-comments.php`) so theme updates don't wipe it:

```php
add_action( 'rest_api_init', function () {
    // Replace core's reflect-any-origin handler with an explicit whitelist.
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $served ) {
        $allowed = array(
            'https://thenoraedit.com.au',
            'https://www.thenoraedit.com.au',
        );

        $origin = get_http_origin(); // the request's Origin: header

        if ( $origin && in_array( $origin, $allowed, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
            header( 'Vary: Origin', false );
            header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
            header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
            header( 'Access-Control-Max-Age: 86400' );
        }

        return $served;
    } );
} );
```

> ⚠️ **Only one handler may set `Access-Control-Allow-Origin`.** If a CORS
> plugin (or another snippet) is active alongside this, the response carries the
> header **twice** and browsers reject it ("header contains multiple values").
> Keep a single source of truth.

Verify — you want a single ACAO header, and none for other origins:

```bash
# Want: 1
curl -s -i -X OPTIONS 'https://wordpress.thenoraedit.com.au/wp-json/wp/v2/comments' \
  -H 'Origin: https://thenoraedit.com.au' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type' \
  | grep -ci 'access-control-allow-origin'
```

Also required: **Settings → Discussion → "Users must be registered and logged in
to comment"** must be **off**, otherwise anonymous comment posts return `401`
(which looks like a failure but isn't a CORS problem).

### Updating the four channels

The home-page channel cards and the channel pages are defined in
**`lib/constants.ts`**:

- `FOUR_CHANNELS` — the four pinned home cards (image + title + `href`)
- `CHANNELS` — titles/slugs used for routing and `NAV_LINKS`; only entries whose
  `slug` starts with `/channel/` generate a channel page

---

## 6. Layout & design system

- Everything is authored on the **1440px Figma canvas**. `r(px)` in `lib/px.ts`
  converts a Figma pixel value to `rem`.
- `app/globals.css` sets the root `font-size` to `calc(100vw / 90)`, so **1rem =
  16px at 1440px** and the whole layout scales down proportionally on smaller
  screens, capped at 1440px.
- Use **`useIsMobile()`** (breakpoint 768px) for mobile-specific adjustments.
- Brand colours live in `lib/px.ts` (`COLORS`) and are mirrored as CSS variables
  in `globals.css`. Section geometry (canvas heights, band offsets) is in
  `BANDS`.
- Add new colours/dimensions to `lib/px.ts` (and `globals.css` if needed) rather
  than hard-coding hex values in components.

---

## 7. Build & deploy (cPanel zip workflow)

> **The old `git commit && git push` deploy is gone** (that pushed to Vercel).
> The site is now deployed as a **static zip uploaded to cPanel**.

### The process

1. **Build** the static site:

   ```bash
   yarn build        # (or `yarn deploy`, which does the same)
   ```

   This writes the finished site into the **`out/`** folder.

2. **Zip the contents of `out/`.** Select everything *inside* `out/`
   (`index.html`, `_next/`, `assets/`, `article/`, `channel/`, …) and compress it
   into a single `.zip`. **Zip the contents, not the `out` folder itself**, so the
   files land directly in the document root when extracted.

3. **Upload & extract** the zip on cPanel (see below).

### How to zip the `out` folder

**Windows** — on a machine with **7-Zip** (recommended):

1. Open the `out` folder in File Explorer.
2. Select **all** items with `Ctrl+A` (everything *inside* `out`).
3. Right-click → **7-Zip → Add to "out.zip"**

Alternatively, from a terminal in the project folder:

```bat
tar -a -c -f website.zip -C out .
```

> ⚠️ Do **not** use PowerShell's `Compress-Archive`. It stores Windows backslash
> separators (`article\foo\index.html`), which extract as broken single files on
> Linux/cPanel. Use 7-Zip or the `tar` command above.

**macOS / Linux:** open the `out` folder, select all contents, right-click →
**Compress** (or `cd out && zip -r ../website.zip .`).

### Uploading to cPanel

1. Log in to **cPanel → File Manager**.
2. Navigate to **`public_html/website_979d1048`** (the site's document root).
3. **Upload** the zip.
4. Select the uploaded zip and right-click **Extract** (into the same
   `public_html/website_979d1048` folder).
5. Confirm **`index.html`** now sits directly inside
   `public_html/website_979d1048/`, then **delete the uploaded zip**.

Because the export uses `trailingSlash: true`, every route is emitted as a
`folder/index.html` (e.g. `/article/bridging-worlds-to-thrive/index.html`), which
is why a plain file extraction works with no server config.

### Tips

- Extracting overwrites files with the same names. The hashed bundles in
  `_next/` change name on each build, so old ones can accumulate — optionally
  delete the `_next` folder on the server before extracting to start clean.
- No `.htaccess` is shipped; the host's defaults serve the static files.
- `out/` and `*.zip` are git-ignored.
- `vercel.json` is **legacy** and no longer used.

---

## 8. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| Comments don't show on an article | WordPress post title ≠ JSON `title`, or `WORDPRESS_API_URL` was missing at build time. Verify both, then rebuild. |
| Comments don't update after adding/renaming WordPress posts | Rebuild with `yarn build` — it clears Next's fetch cache first. A bare `next build` can reuse the previous build's post list and keep the stale title→ID mapping. |
| Comment list/post blocked by CORS in the browser | WordPress isn't sending `Access-Control-Allow-Origin` for `thenoraedit.com.au`, or sends it twice. See "WordPress CORS for comments (server-side config)". |
| New article 404s | Its `slug` was not added to `ARTICLES` in `app/article/[slug]/page.tsx`. |
| Article renders "Article not found." | The `contentKey` in `ARTICLES` has no matching key in `lib/article-content.json`. |
| Images missing | File not in `public/assets/`, or referenced with a path instead of a bare filename. |
| Fonts/colours look off | Font `<link>` tags are in `app/layout.tsx`; tokens are in `lib/px.ts`. |
| Site loads at wrong nested URL | `NEXT_PUBLIC_BASE_PATH` should be **empty** for the domain route; set it only if hosted in a sub-folder, then rebuild. |
| Zip extracts as weird single files (e.g. `article\foo\index.html`) | The zip was made with PowerShell `Compress-Archive`. Re-zip with 7-Zip, or `tar -a -c -f website.zip -C out .`, so entries use forward slashes. |
| Build fails fetching WordPress | `getArticleIdMap` fails soft (returns `{}`), so build should still succeed — check `.env` anyway. |

---

## 9. Future recommendation: article bodies in WordPress

> Not the current setup — this is a suggested direction for a future iteration.

Today the article **copy** lives in this repo (`lib/article-content.json`) while
WordPress holds a **title-only** post per article, used solely for comments. That
works, but it has real friction:

- Editing an article means editing JSON and shipping a new build — non-technical
  editors can't do it.
- The two sources are joined by an **exact title match** (`getArticleIdMap`), so
  renaming a title in one place silently breaks comments.
- The WordPress posts are effectively dead weight (title only, no content).

**Recommendation:** make WordPress the single source of truth for article bodies
and have the site read content from it.

Rough shape of the migration:

- Store each article's body in the WordPress post `content` (Gutenberg blocks),
  or—preferably, to preserve the design—in structured custom fields (ACF) that
  mirror the current section types: `paragraph` (+ `dropCap`), `heading`
  (+ `marker`), `image` (+ `parallaxRange`), `quote` (+ `attribution`), `list`.
- Mark which posts are articles via a category / custom post type / flag,
  replacing the hand-maintained `ARTICLES` array.
- Fetch the body in `app/article/[slug]/page.tsx` and map it onto the existing
  `Hero` / `Body` components.

Why structured fields over raw Gutenberg HTML: the design relies on drop caps,
heading markers, pull quotes and per-image parallax ranges, which plain post HTML
won't reproduce 1:1. ACF (or a small set of block patterns) is the safer mapping.

Benefits:

- Editors publish and update in WordPress; no JSON edits or code changes.
- One source of truth — removes the duplicate title-only posts and the fragile
  title-match coupling (and the whole `seed:wordpress` step).
- Comments are naturally tied to the same post that holds the content.

**Important caveat:** this site is a **static export** (`output: "export"`), so
article changes would *still* require a rebuild + redeploy to go live. Removing
that step would mean switching to SSR/ISR, which needs a Node runtime — not the
current static cPanel hosting. Even with WordPress as the source, build-time
fetches must bypass Next's cache, which `scripts/clean-next-cache.mjs` already
handles.

---

*The NORA Edit — maintain with `yarn dev`, ship with `yarn build` + a manual zip of `out/`.*
