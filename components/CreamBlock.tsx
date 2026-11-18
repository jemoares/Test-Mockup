"use client";

import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { r, COLORS, fullBleed, gridInner } from "@/lib/px";
import { useTransform, easeInOut } from "framer-motion";
import { Accent, Arrow, AccentGIF } from "./bits";
import { Carousel } from "./Carousel";
import { FadeUp, ScrollLetters } from "./anim";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DateTime } from 'luxon';
import { EDITORIAL_ARTICLES, EDITORIAL_ARTICLES_1, GCard, FOUR_CHANNELS, CHANNELS, Channel, EDITORIAL_ARTICLES_INTELLIGENCE } from '@/lib/constants';
import { useIsMobile } from "./useIsMobile";
import { useBackLabel } from "@/lib/useBackLabel";

const TEAR_H = 72;
const CREAM_TOP = 46;


const INTRO_TOP = 100;
const INTRO_BLOCK_H = 440;
const GALLERY_H = 3000; // GalleryBlock section height (two collage clusters + the line)
const PIN_EXTRA = 800; // Increased to extend the scrolling area for the carousel

// Deterministic, slightly-varied delay so tiles ink in organically (not in lock-step).
const stagger = (i: number) => ((i * 97) % 7) * 0.05;

// function Media({ tile }: { tile: Tile }) {
//   const box: CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
//   if (tile.kind === "video") {
//     return <VideoBg name={tile.src} style={box} />;
//   }
//   return <img src={asset(`/assets/${tile.src}.${tile.ext}`)} alt="" style={box} />;
// }

// Cream fill + mirror-tiled crumpled-paper texture (40% opacity) that backs a cream
// section of the given design-px height. `tear` adds the torn-paper divider at the very
// top — used only on the FIRST cream section (IntroBlock), where the cream meets the dark
// Section 2 behind it and the tear's transparent rips reveal it. Lower cream sections sit
// on flat cream. Full-bleed; clipped by the section's overflow:hidden.
export function CreamBackdrop({ height, tear = false }: { height: number; tear?: boolean }) {
  const top = tear ? CREAM_TOP : 0;
  const tiles = Math.max(1, Math.ceil((1000 - top) / 1797));
  return (
    <>
      {tear && (
        <img
          src={asset("/assets/page-tear.png")}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: r(TEAR_H),
            objectFit: "fill",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: r(top),
          bottom: 0,
          background: COLORS.cream,
        }}
      />

      {Array.from({ length: tiles }).map((_, i) => (
        <img
          key={i}
          src={asset("/assets/paper-texture.jpg")}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: r(top + i * 1797),
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
            transform: i % 2 === 1 ? "scaleY(-1)" : undefined,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

// IntroBlock — the first cream section: the editorial intro statement, then the "Four
// channels" heading that introduces the pinned channel cards in the very next section
// (<ChannelsPinned>). Normal flow with a higher z-index than the two pinned dark sections,
// so it slides up and overlaps Section 2 on scroll; its torn-paper top is the cream→dark seam.
export function IntroBlock() {
  const [showText, setShowText] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => { const timer = setTimeout(() => setShowText(true), 2000); return () => clearTimeout(timer); }, []);
  return (
    <section
      style={{
        position: "relative",
        zIndex: 3,
        ...fullBleed,
        height: isMobile ? r(900) : r(INTRO_BLOCK_H),
        overflow: "hidden",
      }}
    >
      <CreamBackdrop height={INTRO_BLOCK_H} tear />

      <div style={gridInner}>
        {/* Intro statement — the opening sentence sits on its own line, then the body wraps
          to three centred lines. The purple underline and the blue marker circle are
          attached inline to their words ("point of view" / "succeed") so they always track
          the type instead of floating at fixed Figma coordinates. */}
        {showText && (
          <FadeUp
            y={20}
            style={{
              position: "absolute",
              left: r(50),
              top: r(INTRO_TOP),
              width: r(1340),
            }}
          >
            <p
              className="font-ivy"
              style={{
                fontSize: isMobile ? r(70) : r(33),
                lineHeight: isMobile ? r(80) : r(46),
                fontWeight: 300,
                color: "#000",
                textAlign: "center",
              }}
            >
              <br />
              The NORA Edit is a curated selection of thought-provoking
              <br />
              and consequential pieces from across the retail industry,
              <br />
              <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
                refined
                {/* The blue marker circle — the existing accent-scribble-a graphic, attached
                  here so it always sits over "succeed". SIZE = width / height (design px,
                  keep ~2.6 : 1 to avoid squashing). POSITION = the translate() offsets:
                  -50%,-50% centres it on the word; nudge e.g. translate(-50%, -54%) up. */}
                <img
                  src={asset("/assets/NOR0001_Swiggle2-Eblue_1080x1080PX.gif")}
                  alt=""
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: isMobile ? r(60) : "30%",
                    top: isMobile ? r(60) : "70%",
                    width: isMobile ? r(350) : r(150),
                    transform: "translate(-46%, -50%)",
                    pointerEvents: "none",
                  }}
                />
              </span>
              {" "}by NORA's advisors and editorial team to ensure you have
              <br />
              access to content that steers leadership.
            </p>
          </FadeUp>
        )}
      </div>
    </section>
  );
}


/* ---------------------------------------------------------------------------
   ChannelsPinned — the four channel cards, lifted out of the cream block so they
   can PIN. As the user scrolls into this section it sticks to the viewport (the
   page appears to freeze) and the cards scrub sideways; once the slide completes
   the section releases and normal downward scrolling resumes into the footer.

   A true viewport pin needs position:sticky against the document scroll, which is
   impossible inside CreamBlock's overflow:hidden / absolutely-positioned canvas —
   hence its own section here. The section is (100vh + PIN_EXTRA) tall: the inner
   wrapper sticks at top:0 for 100vh while the extra PIN_EXTRA of scroll is what the
   horizontal scrub consumes.
--------------------------------------------------------------------------- */
export function ChannelsPinned() {
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const carouselProgress = useTransform(
    scrollYProgress,
    [0, 1, 1], // Input range: vertical scroll progress
    [0, 1, 1],   // Output range: carousel horizontal progress (0 to 1, then holds at 1)
    { ease: easeInOut } // Apply easing for a smoother transition
  );
  const HEADING_TOP = 30;

  // The hand-written note in the cards' left lane fades out as they scrub over it.
  const noteRef = useRef<HTMLDivElement>(null);
  const fadeNoteOnScroll = (p: number) => {
    const el = noteRef.current;
    if (el) el.style.opacity = String(Math.max(0, Math.min(1, 1 - p / 0.5)));
  };

  const fitRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  return (
    <section
      ref={trackRef}
      style={{
        position: "relative",
        zIndex: 3,
        ...fullBleed,
        height: `calc(100vh + ${r(PIN_EXTRA)})`,
        background: COLORS.cream,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: isMobile ? r(1800) : r(1000),
          overflow: "hidden",
        }}
      >
        <CreamBackdrop height={2600} />
        <div style={gridInner}>
          {/* "Four channels" heading */}
          <FadeUp
            y={20}
            style={{
              position: "relative",
              left: r(100),
              top: r(HEADING_TOP),
              width: isMobile ? r(1000) : r(440),
            }}
          >
            <h2
              className="font-ivy"
              style={{
                fontSize: isMobile ? r(120) : r(70),
                lineHeight: isMobile ? "100%" : r(65),
                letterSpacing: r(-1.3),
              }}
            >
              Four channels
              <br />
              infinite angles
            </h2>
          </FadeUp>
          {/* Cards, vertically centred in the pinned viewport. The inner wrapper is
              scaled down (fitScale) to keep the full, staggered block inside the viewport
              so no arrows get clipped on shorter windows. */}
          <div
            style={{
              position: "relative",
              left: 0,
              right: 0,
              top: r(450),
              transform: "translateY(-50%)",
              zIndex: 5,
            }}
          >
            <div
              ref={fitRef}
              style={{ transform: `scale(${fitScale})`, transformOrigin: "center" }}
            >
              <Carousel
                onProgress={fadeNoteOnScroll}
                scrollProgress={carouselProgress} // Use the transformed progress
                style={{
                  gap: r(22),
                  alignItems: "flex-start",
                  paddingLeft: isMobile ? r(600) : r(395),
                  paddingRight: r(60),
                  // The big italic numbers (100px glyph in a 50px line-box) overflow upward;
                  // the track's overflow-y:hidden would clip their tops without this headroom.
                  marginTop: isMobile ? r(400) : r(50),
                  paddingBottom: r(40),
                }}
              >
                {FOUR_CHANNELS.map((c, i) => (
                  <div
                    key={i}
                    style={{ flex: "0 0 auto", marginTop: i % 2 === 1 ? r(132) : 0 }}
                  >
                    <ChannelCard channel={c} />
                  </div>
                ))}
              </Carousel>
              {/* Hand-written note in the left lane — fades as the cards scrub over it. */}
              <div
                ref={noteRef}
                className="font-caveat"
                style={{
                  position: "absolute",
                  left: r(100), 
                  top: r(130),
                  width: isMobile ? r(400) : r(200),
                  transform: "rotate(-9.2deg)",
                  transformOrigin: "center",
                  fontSize: isMobile ? r(80) : r(33),
                  lineHeight: isMobile ? "100%" : r(40),
                  letterSpacing: r(-1.05),
                  color: "#000",
                }}
              >
                "The greatest danger in times of turbulence is not the turbulence—it is to act with yesterday's logic."<br/> - Peter Drucker
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function ChannelCard({ channel }: { channel: Channel }) {
  const isMobile = useIsMobile();
  return (
    <Link href={channel.href} style={{ "textDecoration": "none" }}>
      <div style={{ display: "flex", 
        flexDirection: "column", 
        gap: r(0), 
        width: isMobile ? r(750) : r(313) 
        }}>
        <div style={{ position: "relative", 
          width: isMobile ? r(500) : r(313), 
          height: isMobile ? r(1050) :r(469)
          }}>
          <img
            src={asset(`/assets/${channel.image}.jpg`)}
            alt={channel.title}
            style={{ 
              width: isMobile ? r(713) : r(313), 
              height: isMobile ? r(1050) : r(450), 
              objectFit: "cover", 
              display: "block" }}
          />
          <span
            className="font-ivy"
            style={{
              position: "absolute",
              bottom: r(30),
              left: isMobile ? r(30) : r(10),
              right: r(24),
              fontSize: isMobile ? r(60) : r(30),
              lineHeight: isMobile ? "100%" : r(36),
              letterSpacing: r(-0.4),
              color: "#fff",
              zIndex: 1
            }}
          >
          {channel.title}{" "}
          <Arrow style={{ color: "#fff", verticalAlign: "middle", marginLeft: r(8) }} isMobile={isMobile} />
          </span>
        </div>
      </div>
    </Link>
  );
}


export function EditorialSection({ title, article }: { title: string, article: boolean }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const mobileFont = article && isMobile ? 110 : 85;
  const backLabel = useBackLabel();
  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        ...fullBleed,
        background: COLORS.cream,
        paddingBottom: r(300),
        paddingTop: (article) ? r(20) : undefined,
      }}
    >
      <CreamBackdrop height={1000} />

      {(article) ? (
        <div style={{ margin: isMobile ? `${r(50)} 0` : 0 }}>
          <button
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push("/");
            }}
            className="arrow-link back"
            style={{ gap: r(24), position: "relative", top: r(0), left: r(50), background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="arrow" src={asset("/assets/arrow-back.svg")} alt="" style={{ 
              width: isMobile ? r(25) : r(16), 
              height: isMobile ? r(20) : r(9), 
              transform: "rotate(180deg)" }} />
            <span className="label" style={{ color: COLORS.black, fontSize: (isMobile) ? r(35) : r(10) }}>Back to {backLabel}</span>
          </button>  
        </div>
      ) : (<></>)}

      <div style={{
        position: "relative",
        left: "50%",
        top: 0,
        transform: "translateX(-50%)",
        width: r(1300),
        height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: r(60), minHeight: "100%"
      }}>
        <ScrollLetters
          text={title}
          className="font-ivy"
          style={{
            marginTop: r(30), 
            textAlign: "center",
            fontSize: (isMobile) ? r(mobileFont) : r(60),
            lineHeight: r(65),
            letterSpacing: r(0),
            color: "#000",
            marginBottom: isMobile ? r(1) : r(1),
          }}
        />

        {(title == "This month's consequential insights") ? (
          <>
            {/* <Accent src="accent-divider" left={480} top={100} width={380} height={6} /> */}
            {!isMobile &&<ArticleArrow left={-40} top={180} />}
            <AccentGIF 
              src="NOR0001_Swiggle5-Violet_1080x1080PX" 
              left={isMobile ? 400 : 500} 
              top={isMobile ? -100 : 15} 
              width={isMobile ? 650 : 400} 
              height={isMobile ? 400 : 150} 
            />
            <AccentGIF 
              src="NOR0001_Swiggle8-Violet_1080x1080PX" 
              left={isMobile ? -200 : 0} 
              top={isMobile ? -200 : -100} 
              width={isMobile ? 400 : 300} 
              height={isMobile ? 400 : 300} 
            />
          </>
        ) : (<></>)}

        {(title == "The intelligence unit") ? (
          <>
            <Accent 
              src="accent-divider" 
              left={isMobile ? 400 : 510} 
              top={isMobile ? 120 : 95} 
              width={isMobile ? 500 : 280} 
              height={isMobile ? 15 : 7} 
            />
          </>
        ) : (<></>)}


        {(title != "This month's consequential insights" && !isMobile) ? 
        <>{/* <SitAmetNote left={-50} top={200} /> */}
          <CreativityNote left={1150} top={600} /></> 
        : 
        (<></>)}


        <div
          className="gallery"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: r(24), // Space between columns
            width: isMobile ? "100%" : "80%", // Take full width of gridInner
            justifyContent: "center",
            alignItems: "flex-start", // Keeps columns from stretching vertically
            padding: r(20),
            boxSizing: "border-box",
          }}
        >
          {(() => {


            const ARTICLES = (() => {
              if(title == "This month's consequential insights") return EDITORIAL_ARTICLES;
              if(title == "In collaboration") return EDITORIAL_ARTICLES_1;
              if(title == "The intelligence unit") return EDITORIAL_ARTICLES_INTELLIGENCE;
              return EDITORIAL_ARTICLES_1;
            })();

            const numColumns = isMobile ? 2 : 3;
            const articles = [...ARTICLES];
            const centeredLast = isMobile && articles.length % 2 !== 0 ? articles.pop() : null;
            const columns: GCard[][] = Array.from({ length: numColumns }, () => []);
            articles.forEach((card, index) => {
              columns[index % numColumns].push(card);
            });
            const renderedColumns = columns.map((col, colIndex) => (
              <div key={"col" + colIndex} className="gallery-col" style={{
                display: "flex",
                flexDirection: "column",
                gap: r(24), // Space between stacked frames inside the column
                flex: 1, // Distributes width equally among the columns
              }}>
                {col.map((card, i) => (
                  <FadeUp key={"e" + colIndex + "-" + i} amount={0.2} delay={i * 0.1}>
                    <Link href={card.href || "#"} style={{ textDecoration: "none"}}>
                      <ArticleCard kind={card.kind} blurb={card.blurb} caption={card.caption} image={card.image} title={card.title} href={card.href} color={card.color} author={card.author} date={card.date} textColor={card.textColor} />
                    </Link>
                  </FadeUp>
                ))}
              </div>
            ));
            if (centeredLast) {
              renderedColumns.push(
                <div key="centered-last" style={{ flex: "0 0 100%", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: `calc((100% - ${r(24)}) / 2)` }}>
                    <FadeUp amount={0.2} delay={0}>
                      <Link href={centeredLast.href || "#"} style={{ textDecoration: "none"}}>
                        <ArticleCard kind={centeredLast.kind} blurb={centeredLast.blurb} caption={centeredLast.caption} image={centeredLast.image} title={centeredLast.title} href={centeredLast.href} color={centeredLast.color} author={centeredLast.author} date={centeredLast.date} textColor={centeredLast.textColor} />
                      </Link>
                    </FadeUp>
                  </div>
                </div>
              );
            }
            return renderedColumns;
          })()}
        </div>
      </div>
    </div>
  );
}

// ArticleCard — the navy article card in the gallery. It was previously a hover overlay
// (.card-overlay) revealed over a photo; the redesign drops the hover and renders it as a
// standalone tile. "tall" = 312×474 portrait (Feature writers), "wide" = 424×294 landscape
// (NORA unit) — the layouts differ only in where the title block sits. Internal coordinates
// are the exact Figma offsets (node 259:358 etc.); the caption renders beneath the card.
function ArticleCard({
  kind,
  blurb,
  caption,
  image,
  title,
  href,
  color,
  author,
  date,
  textColor
}: {
  kind: "tall" | "wide";
  blurb: string;
  caption?: string;
  image?: string;
  title?: string;
  href?: string;
  color?: string;
  author?: string;
  date?: string;
  textColor?: string;
}) {
  const isMobile = useIsMobile();
  const tall = isMobile ? false : kind === "tall";
  let aspectRatio: string;
  if(isMobile) {
    aspectRatio = tall ? "3 / 4" : "3 / 5"; // Portrait vs Landscape
  } else {
    aspectRatio = tall ? "3 / 4" : "3 / 3"; // Portrait vs Landscape
  }
  const articleDate = date ? DateTime.fromISO(date).toFormat("dd MMMM @ t") : DateTime.now().toFormat("dd MMMM @ t")

  return (
    <div style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        className="frame"
        style={{
          position: "relative",
          background: image ? undefined : color,
          color: textColor ? textColor : "white",
          aspectRatio: aspectRatio,
          width: "100%",
          backgroundColor: color, // Inner white matting
          boxShadow: `0 ${r(10)} ${r(20)} rgba(0, 0, 0, 0.15), 0 ${r(3)} ${r(6)} rgba(0, 0, 0, 0.10)`, // Soft wall drop-shadow
          padding: `${r(10)} ${r(24)}`, // White spacing around the picture
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Hide overflowing content
        }}
      >
        {image && (
          <>
            <img
              src={asset(`/assets/${image}`)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
              }}
            />
          </>
        )}
        {/* Content wrapper, now using flexbox for vertical stacking */}
        <div style={{ 
          position: "absolute", 
          inset: 0,
          zIndex: 1, 
          display: "flex", 
          flexDirection: "column",
          paddingBottom: isMobile ? r(30) : r(20),
          paddingLeft: isMobile ? r(50) : r(20),
          gap: isMobile ? r(10) : r(0) }}>
          <div style={{ flex: "0 0 auto", marginTop: isMobile ? r(50) : r(15)}}>
            <span
              className="font-caveat" 
              style={{ 
                fontSize: isMobile ? r(40) : r(20), 
                lineHeight: isMobile ? r(60) : r(30), 
                color: textColor ?? "white", 
                marginBottom: isMobile ? r(60) : r(20),
              }}
            >
              {articleDate}
            </span>
          </div>
          <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h3
              className="font-ivy" 
              style={{ 
                fontSize: isMobile ? r(50) : r(20), 
                lineHeight: isMobile ? "100%" : "100%", 
                width: isMobile ? r(350) : r(200),
                fontWeight: 400, 
                whiteSpace: "pre-line",
              }}
            >
              {title}
            </h3>
            {author && <span
              className="font-inter" 
              style={{ 
                fontSize: isMobile ? r(30) : r(13.2), 
                lineHeight: isMobile ? "100%" : "100%",
                width: isMobile ? r(300) : r(150),
                marginTop: r(20),
                marginBottom: r(10),
                whiteSpace: "pre-line",
              }}
            >
              {(author.includes("In collaboration")) ? `${author}` : `By ${author}`}
            </span>
            }
            <div
              aria-hidden
              style={{ 
                width: isMobile ? r(100) : r(50), 
                height: r(2), 
                background: textColor ?? "white", 
                marginTop: r(20),
                marginBottom: r(20), 
              }}
            />
            <p
              className="font-inter"
              style={{ 
                fontSize: isMobile ? r(35) : r(13), 
                lineHeight: isMobile ? "100%" : "100%", 
                width: isMobile ? r(300) : r(150), 
                letterSpacing: r(0.28),
                whiteSpace: "pre-line",
              }}
            >
              {blurb}
            </p>
          </div>
          <Arrow isMobile={isMobile} style={{ 
            color: textColor ?? "#fff",
            flex: "0 0 auto" }} />
        </div>
      </div>
    </div>
  );
}

// "Lorem ipsum dolor sit amet" hand-written note. The blue marker oval (accent-scribble-a)
// loops around the last line; the lines step right to echo the hand-written original.
function SitAmetNote({ left, top }: { left: number; top: number }) {
  return (
    <FadeUp y={16} amount={0.4} style={{ position: "absolute", left: r(left), top: r(top), width: r(180) }}>
      <div
        className="font-caveat"
        style={{ transform: "rotate(-3deg)", transformOrigin: "left top", fontSize: r(38.5), lineHeight: r(42), letterSpacing: r(-1.05), color: "#000" }}
      >
        <div>Lorem</div>
        <div style={{ marginLeft: r(12) }}>ipsum dolor</div>
        <div style={{ marginLeft: r(24) }}>
          <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
            sit amet
            <img
              src={asset("/assets/NOR0001_Swiggle2-Eblue_1080x1080PX.gif")}
              alt=""
              aria-hidden
              style={{ position: "absolute", left: "50%", top: "60%", width: r(150), height: r(150), transform: "translate(-50%, -50%)", pointerEvents: "none" }}
            />
          </span>
        </div>
      </div>
    </FadeUp>
  );
}

// "You don't need all the answers, just the creativity." hand-written note, with the blue
// underline swoosh (accent-note-underline) under the final word. Lines step right.
function CreativityNote({ left, top }: { left: number; top: number }) {
  return (
    <FadeUp y={16} amount={0.4} style={{ position: "absolute", left: r(left), top: r(top), width: r(200) }}>
      <div
        className="font-caveat"
        style={{ transform: "rotate(-3deg)", transformOrigin: "left top", fontSize: r(38.5), lineHeight: r(40), letterSpacing: r(-1.05), color: "#000" }}
      >

        {/* Life can only be understood backwards; but it must be lived forwards */}
        <div>Life can only</div>
        <div style={{ marginLeft: r(16) }}>be understood backwards;</div>
        <div style={{ marginLeft: r(26) }}>but it must be</div>
        <div style={{ marginLeft: r(40) }}>lived forwards</div>
        <div style={{ marginLeft: r(50) }}>
          <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
            <img
              src={asset("/assets/NOR0001_Swiggle5-Eblue_1080x1080PX.gif")}
              alt=""
              aria-hidden
              style={{ position: "absolute", left: r(-40), top: r(-120), width: r(200), height: r(200), pointerEvents: "none" }}
            />
          </span>
        </div>
      </div>
    </FadeUp>
  );
}


function ArticleArrow({ left, top }: { left: number; top: number }) {

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <FadeUp y={16} amount={0.4} style={{ position: "absolute", left: r(left), top: r(top), width: r(200) }}>
      <div
        className="font-caveat"
        style={{ transform: "rotate(-3deg)", transformOrigin: "left top", fontSize: r(38.5), lineHeight: r(40), letterSpacing: r(-1.05), color: "#000" }}
      >
        Featured POV
        <img
          src={asset("/assets/right-up-arrow-svgrepo-com.svg")}
          alt=""
          aria-hidden
          style={{ position: "absolute", left: r(50), top: r(50), width: r(100), height: r(100), pointerEvents: "none", transform: (isSafari) ? "rotate(90deg)" : undefined, transformOrigin: (isSafari) ? "center center" : undefined}}
        />
      </div>
    </FadeUp>
  );
}
