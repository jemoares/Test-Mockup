"use client";

import { asset } from "@/lib/asset";
import { r, HERO_H, fullBleed, gridInner } from "@/lib/px";
import { VideoBg } from "./Media";
import { ReadLink } from "./bits"; 
import { Reveal } from "@/components/article/anim";
import { useIsMobile } from "./useIsMobile";

import { WpPost } from "@/lib/wordpress";

/* ---------------------------------------------------------------------------
   Section 1 — dark cinematic hero (woman + static TV). Pinned (position: sticky)
   so Section 2 slides up and overlaps it on scroll (the singsing.movie effect).

   The copy is no longer shown on load — it BUILDS as the user scrolls. The left
   headline, then the right paragraph, then the READ ARTICLE link each fade up + in
   one after another, scrubbed to scroll position. A flow spacer (HERO_REVEAL_EXTRA)
   after the section keeps the hero pinned long enough for the sequence to play out
   and dwell before Section 2 rises over it.
--------------------------------------------------------------------------- */

// Scroll windows for the three copy elements, in 1440-canvas design px (scaled to
// real px at runtime by useScrollScale). Each overlaps the next slightly so the
// build reads as continuous rather than stepped.
// const HEADLINE: [number, number] = [70, 320];
// const PARAGRAPH: [number, number] = [300, 570];
// const READLINK: [number, number] = [540, 820];

// Extra pinned scroll reserved after the hero so the build can finish and dwell
// before Section 2 covers it. Exported so Section 2 can anchor its own build
// windows to the scroll position at which it slides into place.
export const HERO_REVEAL_EXTRA = 0;
 
export function Hero() {
  const isMobile = useIsMobile();
  // const excerpt = post.excerpt.rendered.replace(/<p>|<\/p>|\n/g, "");

  return (
    <>
      <section
        style={{
          position: "sticky",
          top: 0,
          height: r(HERO_H),
          minHeight: "100vh",
          ...fullBleed,
          overflow: "hidden",
          background: "#000",
          zIndex: 1,
        }}
      >
        {/* Animated full-bleed background */}
<div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
  {/* Background video shifted to the right */}
  <div
    style={{
      position: "absolute",
      inset: "-8%",
      transform: "translateX(8%)",
    }}
  >
    <VideoBg name="hero-tv-new" />
  </div>

  {/* Darkness focused on the text area */}
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(to right, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.38) 35%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0) 100%)",
      pointerEvents: "none",
    }}
  />
</div>

        {/* Top vignette for nav legibility (Figma Rectangle 49) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            bottom: "auto",
            height: r(141),
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0))",
            pointerEvents: "none",
          }}
        />
        {/* Lower gradient behind the headline (Figma Rectangle 48). Anchored to the
            section's BOTTOM so its dark end always meets the bottom of the image —
            full-bleeding with the video the same way on tall viewports (where the
            hero grows to 100vh) rather than floating as a fixed mid-screen band. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: r(514),
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))",
            pointerEvents: "none",
          }}
        />

        <div style={gridInner}>

          {/* Left headline — builds first */}
          <Reveal
            delay={1}
            style={{ position: "relative", left: isMobile ? r(20) : r(59), marginTop: isMobile ? r(300) : r(150), width: isMobile ? '100%' : r(573), padding: isMobile ? `0 ${r(60)}` : 0 }}
          >
            <h1
              className="font-ivy"
              style={{
                color: "#fff", 
                fontSize: isMobile ? r(150) : r(60.5),
                lineHeight: isMobile ? '100%' : r(65),
                letterSpacing: r(-1.1),
                fontWeight: 400,
                whiteSpace: isMobile ? "normal" : "nowrap",
              }}
            >
              The diplomat behind<br/>
              Australia’s live selling<br/>
              boom
            </h1>
          </Reveal>


          {/* Right featured article — builds second */}
          <Reveal
            delay={1}
            style={{ position: "relative", left: isMobile ? r(20) : r(59), marginTop: isMobile ? r(100) : r(30), width: isMobile ? 'calc(100% - 40px)' : r(419), padding: isMobile ? `0 ${r(60)}` : 0 }}
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
            Whatnot Australia’s Alex McCauley has seen retail change before, and he thinks live selling comes next.
            </p>
            <img
              src={asset("/assets/NOR0001_Swiggle5-Violet_1080x1080PX.gif")}
              alt=""
              aria-hidden
              style={{
                display: 'block',
                position: "relative",
                left: isMobile ? r(-140) : r(-40),
                top: isMobile ? r(-170) : r(-70),
                width: isMobile ? r(1000) : r(250),
                height: isMobile ? r(400) : r(150),
              }}
            />
          </Reveal>

          {/* READ ARTICLE (with divider) — builds third, beneath the paragraph */}
          <Reveal
            delay={1}
            style={{ position: "absolute", left: isMobile ? r(20) : r(59), top: isMobile ? r(1300) : r(500) }}
          >
            <ReadLink href="/article/the-diplomat-behind-australias-live-selling-boom" style={{ position: "absolute",left: isMobile ? r(60) : 0, top: isMobile? r(0) : r(18), fontSize: isMobile ? r(50) : undefined}} isMobile={isMobile} />
          </Reveal>

        </div>
      </section>

      {/* Reserves the extra pinned scroll for the build. Sits BEHIND the dark
          sticky sections, so it's given a black backdrop (matching the hero): if
          the hero ever comes up shorter than the viewport, the strip below it
          reveals black rather than the cream page background. In the normal case
          (hero fills the viewport via min-height:100vh) this is never seen. */}
      <div aria-hidden style={{ height: r(HERO_REVEAL_EXTRA), background: "#000" }} />
    </>
  );
}
