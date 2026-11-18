NORA Edit – HRS article integration patch

This patch converts the supplied HRS article HTML into the existing Next.js article system.
It does not replace the entire website.

Copy the files in this patch over the matching paths in your project:

1. lib/article-content.json
   - Keeps all original article entries and adds article19 for the HRS article.
   - The 25 body paragraphs from index(10).html are represented as paragraph sections.
   - Each paragraph is rendered by the existing Body component's Framer Motion Reveal.

2. app/article/[slug]/page.tsx
   - Registers the new slug: /article/performance-trap

3. components/article/Hero.tsx
   - Keeps the existing animated Reveal / RevealImg / Parallax hero behavior.
   - Shows a styled placeholder where the supplied HRS HTML has a hero-image placeholder.
   - Handles an empty byline safely because the supplied HTML does not include one.

IMPORTANT:
- This patch intentionally does NOT include components/SectionTwo.tsx, so your local headline/byline/content edits in that file stay untouched.
- In your local components/SectionTwo.tsx, change only the ReadLink href to:
  href="/article/performance-trap"
- The supplied HTML's publish date is still "[Publish date]". Replace [PUBLISH DATE] in article19.hero.meta in lib/article-content.json when you know the date.
- The supplied HTML did not provide a real hero image; the article template will show the same kind of grey placeholder instead of a broken video/image.
- Existing article-related components (Body and Conversation) are reused. Do not copy the standalone HTML into public/assets/articles for this route.
