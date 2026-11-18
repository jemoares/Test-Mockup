import { IntroSplash } from "@/components/IntroSplash";
import { Hero } from "@/components/Hero";
import { SectionTwo } from "@/components/SectionTwo";
import { ChannelSeparator } from "@/components/ChannelsIntro";
import { IntroBlock, ChannelsPinned, EditorialSection } from "@/components/CreamBlock";
import { getPosts } from "@/lib/wordpress";
import { appStore } from "@/lib/app.store";
import { Nav } from '@/components/Nav';

// The page is one continuous scroll. The two dark sections are pinned
// (position: sticky) with rising z-indexes, so each following section slides up
// and overlaps the previous one — Hero → Section 2 → Paper — exactly the
// singsing.movie stacking effect. From the cream block down it scrolls normally.
export default async function Home() {
  // const allPosts = await getPosts();
  // const heroPost = allPosts[0];
  // const sectionTwoPost = allPosts[0];
  // const channelPosts = allPosts.slice(0, 4); // Assuming first 4 posts for channels
  appStore.set('darkMode', true);
  return (
    <>
      <IntroSplash />
      <main>
        <Nav darkMode={appStore.get('darkMode')}/>
        <Hero />
        <SectionTwo />
        <IntroBlock />
        <ChannelSeparator />
        <ChannelsPinned />
        <EditorialSection title={'This month\'s consequential insights'} article={false} />
      </main>
    </>
  );
}
