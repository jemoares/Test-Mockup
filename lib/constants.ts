import { appStore } from "./app.store";
import { COLORS } from "./px";

export const MONDAY_FORM =
  "https://forms.monday.com/forms/embed/4d32c8387c96ffb1aac090c0050baa55?r=use1";

const GALLERY_OFF = 3580;
const gy = (figmaY: number) => figmaY - GALLERY_OFF;

export type GCard = {
  kind: "tall" | "wide";
  left: number;
  top: number;
  blurb: string;
  caption?: string;
  image?: string;
  title?: string;
  href?: string;
  color?: string;
  author?: string;
  date?: string;
  textColor?: string;
};

type Tile = {
  src: string;
  kind: "img" | "video";
  left: number;
  top: number;
  w: number;
  h: number;
  ext?: string;
};

export type Channel = {
  number: string;
  title: string;
  subtext?: string;
  image: string;
  href: string;
};
export const FOUR_CHANNELS: Channel[] = [
  {
    number: "02",
    title: "Featured POVs",
    image: "paul-greenberg",
    href: "/channel/featured-pov",
  },
  {
    number: "03",
    title: "The intelligence unit",
    image: "The-Intelligence-Unit",
    href: "/channel/the-intelligence-unit",
  },
  {
    number: "01",
    title: "In collaboration",
    image: "in-collaboration",
    href: "/channel/in-collaboration",
  },
  {
    number: "04",
    title: "Behind the scenes at THE ICONIC",
    image: "bts-the-iconic",
    href: "/article/behind-the-scenes-at-the-iconic",
  },
];

export const CHANNELS = [
  {
    slug: "/channel/featured-pov",
    title: "Featured POVs",
    height1: 2000,
    height2: 1500,
  },
  {
    slug: "/channel/the-intelligence-unit",
    title: "The intelligence unit",
    height1: 2000,
    height2: 1500,
  },
  {
    slug: "/channel/in-collaboration",
    title: "In collaboration",
    height1: 4500,
    height2: 2500,
  },
  {
    slug: "/article/behind-the-scenes-at-the-iconic",
    title: "Behind the scenes at THE ICONIC",
    height1: 2100,
    height2: 1500,
  },
  // {
  //   slug: "/channel/the-consequential-insights",
  //   title: "This month's consequential insights",
  //   height1: 1100,
  //   height2: 1000,
  // },
];

export function toggleDarkMode(darkMode: boolean) {
  appStore.set("darkMode", darkMode);
  return darkMode; // You might choose to return void, or the new state, depending on usage.
}

const GALLERY_TILES: Tile[] = [
  // cluster A
  {
    src: "collage-rect26",
    kind: "img",
    ext: "jpg",
    left: 72,
    top: gy(3700),
    w: 184,
    h: 232,
  },
  {
    src: "collage-istock",
    kind: "video",
    left: 344,
    top: gy(4020),
    w: 424,
    h: 268,
  },
  {
    src: "collage-rect33",
    kind: "img",
    ext: "jpg",
    left: 76,
    top: gy(4332),
    w: 196,
    h: 256,
  },
  { src: "hero-tv", kind: "video", left: 1084, top: gy(4392), w: 200, h: 244 },
  // cluster B
  {
    src: "collage-rect33",
    kind: "img",
    ext: "jpg",
    left: 1192,
    top: gy(5308),
    w: 200,
    h: 256,
  },
  {
    src: "collage-istock",
    kind: "video",
    left: 632,
    top: gy(5628),
    w: 424,
    h: 268,
  },
  {
    src: "collage-rect26",
    kind: "img",
    ext: "jpg",
    left: 1024,
    top: gy(5964),
    w: 184,
    h: 228,
  },
  {
    src: "collage-rect59",
    kind: "video",
    left: 72,
    top: gy(6008),
    w: 200,
    h: 240,
  },
];

export const EDITORIAL_ARTICLES: GCard[] = [
    {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "Whatnot Australia’s Alex McCauley has seen retail change before, and he thinks live selling comes next.",
    title: "The diplomat behind Australia’s live selling boom",
    href: "/article/the-diplomat-behind-australias-live-selling-boom",
    author: "",
    image: "Whatnot-Tile.jpg",
    date: "2026-11-09T00:00:00Z",
    textColor: "white"
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "As retailers turn to AI to tackle recruitment pressures, Wingstop Australia...",
    title:
      "Can AI make recruitment more human? Wingstop Australia thinks so.",
    href: "/article/what-ai-in-retail-needs-from-the-systems-underneath-it",
    image: "Workday-Tile.jpg",
    date: "2026-11-02T00:00:00Z",
    author: "In collaboration with Workday"
  },
  {
    kind: "tall",
    left: 0,
    top: 0,
    title: "The performance trap: what an uneven marketing split costs Australian retailers",
    blurb:
      "I was at a high-tech show in Las Vegas a few years ago. The latest high-resolution technology was on dazzling display.",
    href: "/article/the-performance-trap/",
    author: "",
    image: "HRS-Tile.jpg",
    date: "2026-06-10T00:00:00Z",
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Why the right solution partner matters as much as the platform",
    caption: "Industry Persectives",
    title: "The Next Generation of POS: What Australian Retailers Need from Their Technology Partner",
    author: "In collaboration with Fujitsu",
    href: "/article/the-next-generation-of-pos-what-australian-retailers-need-from-their-technology-partner",
    image: "Fujitsu-Tile.jpg",
    date: "2026-11-11T00:00:00Z",
    textColor: "black"
  },
  {
    kind: "tall",
    left: 0,
    top: 0,
    title: "Velocity Summit 2026 Wrap-up",
    caption: "Behind the Scenes at NORA",
    blurb: "More than 120 operations, supply chain, fulfilment and last-mile leaders gathered...",
    href: "/article/velocity-summit-2026-wrap-up",
    image: "Ops-Summit-Tile.jpg",
    date: "2026-11-13T00:00:00Z",
    author: "",
  },


  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "The retailers quietly \n building competitive advantage with Feedonomics ",
    caption: "Industry Persectives",
    title: "The complexity economy",
    href: "/article/complexity-economy",
    image: "Complexity-Economy-Tile.jpg",
    date: "2026-06-10T00:00:00Z",
    author: "Feedonomics",
  },
];

export const EDITORIAL_ARTICLES_FEATURED_POV: GCard[] = [
  {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "Whatnot Australia’s Alex McCauley has seen retail change before, and he thinks live selling comes next.",
    title: "The diplomat behind Australia’s live selling boom",
    href: "/article/the-diplomat-behind-australias-live-selling-boom",
    image: "Whatnot-Tile.jpg",
    date: "2026-11-09T00:00:00Z",
    textColor: "white",
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Purpose can no longer be peripheral it must become essential.",
    title: "Bridging worlds to thrive",
    href: "/article/bridging-worlds-to-thrive/",
    author: "Featured writer: Jeremy Meltzer, founder & CEO, i=Change",
    image: "Bridging-Worlds-That-Thrive-Tile(1).jpg",
    date: "2026-08-21T00:00:00Z",
    textColor: "black",
  },
    {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "Technology challenges us to assert our human values, which means that first of all, we have to figure out what they are.",
    title: "An analogue lens in a digital AI world",
    href: "/article/an-analogue-lens-in-a-digital-ai-world",
    image: "Analog-lens-Tile.jpg",
    date: "2026-06-10T00:00:00Z",
    textColor: "white",
  },
];

export const EDITORIAL_ARTICLES_1: GCard[] = [
  {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "As retailers turn to AI to tackle recruitment pressures, Wingstop Australia...",
    caption: "Behind the Scenes at NORA",
    title:
      "Can AI make recruitment more human? Wingstop Australia thinks so.",
    href: "/article/can-ai-make-recruitment-more-human-wingstop-australia-thinks-so",
    image: "Workday-Tile.jpg",
    date: "2026-11-02T00:00:00Z",
    author: "In collaboration with Workday",
  },
    {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Agentic AI has moved past the demonstration stage in retail. A look at five operational...",
    caption: "From Tools to Agents",
    title: "From Tools to Agents",
    href: "/article/from-tools-to-agents",
    author: "In collaboration with Birdeye",
    image: "Birdeye-Tile.jpg",
    date: "2026-11-04T00:00:00Z",
    textColor: "white"
  },
  {
    kind: "tall",
    left: 0,
    top: 0,
    blurb: "Australian retailers are investing heavily in AI. Far fewer have a record their systems...",
    title:
      "What AI in retail needs from the systems underneath it",
    href: "/article/what-ai-in-retail-needs-from-the-systems-underneath-it",
    image: "Annexa-Tile.jpg",
    date: "2026-11-07T00:00:00Z",
    author: "In collaboration with Annexa"
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Why the right solution partner matters as much as the platform",
    caption: "Industry Persectives",
    title: "The Next Generation of POS: What Australian Retailers Need from Their Technology Partner",
    author: "In collaboration with Fujitsu",
    href: "/article/the-next-generation-of-pos-what-australian-retailers-need-from-their-technology-partner",
    image: "Fujitsu-Tile.jpg",
    date: "2026-11-11T00:00:00Z",
    textColor: "black"
  },
  // {
  //   kind: "wide",
  //   left: 0,
  //   top: 0,
  //   blurb: "A new era of super compliance is fast approaching.",
  //   caption: "Powerful Partnerships: The End of the Hero Retailer",
  //   title: "Powerful partnerships: the end of the hero retailer",
  //   href: "/article/powerful-partnerships",
  //   color: COLORS.blue
  // }
  {
    kind: "tall",
    left: 0,
    top: 0,
    title: "Velocity Summit 2026 Wrap-up",
    caption: "Behind the Scenes at NORA",
    blurb: "More than 120 operations, supply chain, fulfilment and last-mile leaders gathered...",
    href: "/article/velocity-summit-2026-wrap-up",
    image: "Ops-Summit-Tile.jpg",
    date: "2026-11-13T00:00:00Z",
    author: "",
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "The retailers quietly building competitive advantage with Feedonomics ",
    caption: "Industry Persectives",
    title: "The complexity economy",
    href: "/article/complexity-economy",
    author: "In collaboration with Feedonomics",
    image: "Complexity-Economy-Tile.jpg",
    date: "2026-06-10T00:00:00Z",
  },
];



export const EDITORIAL_ARTICLES_INTELLIGENCE: GCard[] = [
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "The Australian consumer is in better shape than the mood in most boardrooms suggests, but the gap between retail winners and losers is set to widen. ",
    title:
      "The great retail decoupling",
    href: "/article/the-great-retail-decoupling/",
    image: "retail-decoupling-tile.jpeg",
    date: "2026-09-11T00:00:00Z",
    author: "Ben Gilbert, Jarden"
  },
  {
    kind: "tall",
    left: 0,
    top: 0,
    blurb:
      "For years, retail rewarded those who moved fastest. Now it favours those who understand what they actually own. ",
    caption: "Industry Persectives",
    title: "ANZ retail media state of play 2026",
    href: "/article/retail-media/",
    image: "retail-media-tile.jpg",
    date: "2026-06-10T10:00:00+08:00",
    author: "In collaboration with Broadsign and Criteo"
  },
  {
    kind: "wide",
    left: 0,
    top: 0,
    blurb:
      "Agentic AI has moved past the demonstration stage in retail. A look at five operational jobs agents are being given today and what separates a good first candidate",
    caption: "Five jobs retailers are handing to agents",
    title: "The state of AI in retail",
    href: "/article/the-state-of-ai-in-retail",
    image: "state-of-ai-tile.jpg",
    date: "2026-09-15T12:00:00+08:00",
    author: "In collaboration with Shopify"
  },
    {
    kind: "tall",
    left: 0,
    top: 0,
    blurb: "Global retail leaders meeting in Berlin delivered a message that will resonate strongly in Australia",
    caption: "Retail at a turning point",
    title: "Retail at a turning point",
    href: "/article/retail-at-a-turning-point",
    image: "retail-tile.jpg",
    date: "2026-07-25T00:00:00Z",
    author: "Peter Knock, NORA Berlin correspondent",
  },
];
