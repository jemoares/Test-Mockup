import { Body } from "@/components/article/Body";
import { Hero } from "@/components/article/Hero";
import { Conversation } from "@/components/article/Conversation";
import { asset } from '@/lib/asset'
import { CSSProperties } from "react";
import { appStore } from "@/lib/app.store";
import { fullBleed } from "@/lib/px";
import articleContent from "@/lib/article-content.json"; // Import the JSON data
import { Nav } from '@/components/Nav';
import { getArticleIdMap } from '@/lib/wordpress';

const ARTICLES = [
  { slug: "the-control-premium", title: "The Control Premium: Retail's New Advantage", contentKey: "article1" },
  { slug: "an-analogue-lens-in-a-digital-ai-world", title: "An Analogue Lens in a Digital AI World ", contentKey: "article2" },
  { slug: "retail-media", title: "", contentKey: "article7" },
  { slug: "national-advantage", title: "National Advantage: Why Australia's Retail Future Won't Be Built on Cost", contentKey: "article3" },
  { slug: "behind-the-scenes-at-the-iconic", title: "Behind the Scenes at THE ICONIC", contentKey: "article8" },
  { slug: "complexity-economy", contentKey: "article9" },
  { slug: "the-next-generation-of-pos-what-australian-retailers-need-from-their-technology-partner", title: "The Next Generation of POS: What Australian Retailers Need from Their Technology Partner", contentKey: "article10" },
  { slug: "velocity-summit-2026-wrap-up", title: "Velocity Summit 2026 Wrap-up", contentKey: "article11" },
  { slug: "can-ai-make-recruitment-more-human-wingstop-australia-thinks-so", title: "Can AI make recruitment more human? Wingstop Australia thinks so.", contentKey: "article12" },
  { slug: "global-commerce-giants", contentKey: "article13" },
  { slug: "what-ai-in-retail-needs-from-the-systems-underneath-it", title: "What AI in retail needs from the systems underneath it", contentKey: "article4" },
  { slug: "powerful-partnerships", title: "Powerful Partnerships: The End of the Hero Retailer", contentKey: "article5" },
  { slug: "next-gen-purpose", title: "Next Gen Purpose: Why Younger Consumers Are Redefining Success", contentKey: "article6" },
  {slug: "from-tools-to-agents", title: "From Tools to Agents", contentKey: "article14"},
  {slug: "retail-at-a-turning-point", title: "Retail at a turning point", contentKey: "article15"},
  {slug: "the-diplomat-behind-australias-live-selling-boom", contentKey: "article16"},
  {slug: "the-great-retail-decoupling", title: "The Great Retail Decoupling", contentKey: "article17"},
  {slug: "the-state-of-ai-in-retail", title: "The State of AI in Retail", contentKey: "article18"},
  { slug: "performance-trap", title: "The performance trap: what an uneven marketing split costs Australian retailers", contentKey: "article19" },
  { slug: "bridging-worlds-to-thrive", title: "Bridging worlds to thrive", contentKey: "article20" }
];

export function generateStaticParams() {
  return ARTICLES.map((channel) => ({
    slug: channel.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const channel = ARTICLES.find((c) => c.slug === params.slug);
  const title = channel ? channel.title : "Channel";
  const style = {
    "--paper-tex": `url(${asset("/assets/paper-texture.jpg")})`,
    ...fullBleed,
  } as CSSProperties;

  // Get the content for the current article
  const currentArticleContent = channel ? articleContent[channel.contentKey as keyof typeof articleContent] : null;

  if (!currentArticleContent) {
    return <div>Article not found.</div>;
  }

  const articleIdMap = await getArticleIdMap();
  const articleId = channel ? articleIdMap[channel.contentKey] : undefined;
  const limitRelated = channel?.contentKey === "article17" || channel?.contentKey === "article18";
  const conversationProps = channel
    ? { ...(articleId ? { articleId } : {}), ...(limitRelated ? { limitRelated: true } : {}) }
    : undefined;

  return (
    <div style={style}>
      <Nav minimal darkMode={false}/>
      <Hero content={currentArticleContent} />
      <Body content={currentArticleContent}/>
      <Conversation {...conversationProps} />
    </div>
  );
}