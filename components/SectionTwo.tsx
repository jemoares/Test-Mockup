"use client";

import { asset } from "@/lib/asset";
import { useScroll } from "framer-motion";
import { r, S2_H, HERO_H, fullBleed, gridInner } from "@/lib/px";
import { VideoBg } from "./Media";
import { ReadLink } from "./bits";
import { ScrollReveal, useScrollScale } from "./anim";
import { HERO_REVEAL_EXTRA } from "./Hero";
import { useIsMobile } from "./useIsMobile";

/* ---------------------------------------------------------------------------
   Section 2 — dark full-bleed (person holding phones). Pinned above the hero
   (higher z-index) so it slides up and covers it, then is itself covered by the
   cream block. Coordinates are Figma-y minus the hero height (898).

   Like the hero, the copy is NOT present when the section arrives — it builds on
   scroll once Section 2 has slid fully into place: headline, then paragraph, then
   READ ARTICLE, one after another. A flow spacer (S2_REVEAL_EXTRA) keeps it pinned
   long enough for the sequence (and a dwell) before the cream block rises over it.
--------------------------------------------------------------------------- */

// Scroll (design px) at which Section 2 is pinned over the hero — i.e. the hero
// height plus the hero's reserved build scroll. The build windows are anchored to
// this so the copy only starts revealing once the section is actually in place.
const S2_BASE = HERO_H + HERO_REVEAL_EXTRA;
const HEADLINE: [number, number] = [S2_BASE + 70, S2_BASE + 320];
const PARAGRAPH: [number, number] = [S2_BASE + 300, S2_BASE + 570];
const READLINK: [number, number] = [S2_BASE + 540, S2_BASE + 820];

// Extra pinned scroll reserved after Section 2 so its build can finish and dwell
// before the cream block rises over it.
const S2_REVEAL_EXTRA = 200;

export function SectionTwo() {
  const { scrollY } = useScroll();
  const scale = useScrollScale();
  const isMobile = useIsMobile();
  // const excerpt = post.excerpt.rendered.replace(/<p>|<\/p>|\n/g, "");

  return (
    <>
      <section
        style={{
          position: "sticky",
          top: 0,
          height: r(S2_H),
          minHeight: "100vh",
          ...fullBleed,
          overflow: "hidden",
          background: "#000",
          zIndex: 2,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <VideoBg name="section2-portrait" style={{ objectPosition: "center" }} />
        </div>

        {/* Side darkening gradients (Figma Rectangle 51 / 52) */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: r(596),
            height: "100%",
            background: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0.6))",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: r(732),
            height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.8))",
            pointerEvents: "none",
          }}
        />

        <div style={gridInner}>
          {/* Left headline — builds first */}
          <ScrollReveal
            scrollY={scrollY}
            scale={scale}
            from={HEADLINE[0]}
            to={HEADLINE[1]}
            style={{ 
              position: "relative", 
              left: isMobile ? r(20) : r(59), 
              marginTop: isMobile ? r(400) : r(150), 
              width: isMobile ? "calc(100% - 40px)" : r(573)
            }}
          >
            <h2
              className="font-ivy"
              style={{
                color: "#fff",
                fontSize: isMobile ? r(125) : r(60.5),
                lineHeight: isMobile ? '100%' : r(55),
                letterSpacing: r(-1.1),
                fontWeight: 400,
                whiteSpace: isMobile ? "normal" : "nowrap",
                padding: isMobile ? `0 ${r(60)}` : 0
              }}
            >
              The performance trap: <br/>
              what an uneven marketing <br/>
              split costs Australian<br/>
              retailers 
            </h2>
          </ScrollReveal>

          <ScrollReveal
            scrollY={scrollY}
            scale={scale}
            from={PARAGRAPH[0]}
            to={PARAGRAPH[1]}
            style={{ 
              position: "relative", 
              left: isMobile ? r(20) : r(59), 
              marginTop: isMobile ? r(100) : r(30), 
              width: isMobile ? "calc(100% - 40px)" : r(419),
              padding: isMobile ? `0 ${r(60)}` : 0
            }}
          >
            <p
              className="font-inter"
              style={{
                color: "#fff",
                fontSize: isMobile ? r(50) : r(17.6),
                lineHeight: isMobile ? r(90) : r(28),
                letterSpacing: r(0.32),
                fontWeight: 400,
              }}
            >
              Australian retailers may be spending more to win customers while underinvesting in the brand that keeps them. At NORA’s Hyperelevance Summit, presenters argued that brand building and a genuine sense of purpose can lift loyalty and margin together.
            </p>           
          </ScrollReveal>

          {/* Right featured article — builds second */}
          <ScrollReveal
            scrollY={scrollY}
            scale={scale}
            from={PARAGRAPH[0]}
            to={PARAGRAPH[1]}
            style={{ 
              position: "relative", 
              left: isMobile ? r(20) : r(59), 
              marginTop: isMobile ? r(100) : r(30), 
              width: isMobile ? "calc(100% - 40px)" : r(419),
              padding: isMobile ? `0 ${r(60)}` : 0
            }}
            
          >
            {/* <p
              className="font-inter"
              style={{
                color: "#fff",
                fontSize: isMobile ? r(50) : r(17.6),
                lineHeight: isMobile ? r(90) : r(28),
                letterSpacing: r(0.32),
                fontWeight: 400,
              }}
            >
              Australian retailers may be spending more to win customers while underinvesting in the brand that keeps them. At NORA’s Hyperelevance Summit, presenters argued that brand building and a genuine sense of purpose can lift loyalty and margin together.
            </p>   */}
            <img
              src={asset("/assets/NOR0001_Swiggle5-Violet_1080x1080PX.gif")}
              alt=""
              aria-hidden
              style={{
                display: "block",
                position: "relative",
                left: isMobile ? r(-140) : r(-40),
                top: isMobile ? r(-270) : r(-100),
                width: isMobile ? r(1000) : r(250),
                height: isMobile ? r(400) : r(150),
              }}
            />
          </ScrollReveal>

          {/* READ ARTICLE (with divider) — builds third, beneath the paragraph */}
          <ScrollReveal
            scrollY={scrollY}
            scale={scale}
            from={HEADLINE[0]}
            to={HEADLINE[1]}
            style={{ position: "absolute", left: isMobile ? r(20) : r(59), top: isMobile ? r(1850) : r(600) }}
          >
            <ReadLink href='/article/performance-trap' style={{ position: "absolute",left: isMobile ? r(60) : 0, top: isMobile? r(0) : r(18), fontSize: isMobile ? r(50) : undefined}} isMobile={isMobile}/>


          {/* <ScrollReveal
            scrollY={scrollY}
            scale={scale}
            from={HEADLINE[0]}
            to={HEADLINE[1]}
            style={{ position: "absolute", left: r(59), top: r(600) }}
          >
            <ReadLink href='/article/an-analogue-lens-in-a-digital-ai-world' style={{ position: "absolute", left: 0, top: r(18) }} /> */}
          </ScrollReveal>
        </div>
      </section>

      {/* Reserves the extra pinned scroll for the build before the cream block rises. */}
      <div aria-hidden style={{ height: r(S2_REVEAL_EXTRA) }} />
    </>
  );
}
