import { EditorialSection } from "@/components/CreamBlock";
import { r } from "@/lib/px";
import { CHANNELS } from "@/lib/constants";
import { Nav } from '@/components/Nav';


export function generateStaticParams() {
  return CHANNELS
    .filter((c) => c.slug.startsWith("/channel/"))
    .map((channel) => ({
      slug: channel.slug.replace("/channel/", ""),
    }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const channel = CHANNELS.find((c) => c.slug === `/channel/${params.slug}`);
  const title = channel ? channel.title : "Channel";
  const isArticle = true;

  if(channel === undefined) return (<></>);

  return (
    <div>
      <Nav minimal darkMode={false}/>
      <EditorialSection title={title} article={isArticle}/>
    </div>
  );
}