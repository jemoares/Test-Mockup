"use client";

import { asset } from "@/lib/asset";
import { r, BANDS, COLORS } from "@/lib/px";
import { Band, Reveal } from "@/components/article/anim";

const A = (p: string) => asset(`/assets/${p}`);
const O = BANDS.footer.offset; // 3810
const top = (y: number) => r(y - O);

// Footer — band 4 (node 183:205). Navy, white type: brand wordmark + newsletter
// capture, a pull-quote, and the legal/social bottom row.
export function Footer() {
  const { height } = BANDS.footer;

  return (
    <Band height={height} z={4} background={COLORS.navy}>
      {/* Brand mark + heading -------------------------------------------- */}
      <Reveal style={{ position: "absolute", left: r(61), top: top(3874) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={A("footer-asterisk.svg")} alt="" style={{ width: r(25), height: r(27) }} />
      </Reveal>
      <Reveal delay={0.06} style={{ position: "absolute", left: r(61), top: top(3915) }}>
        <p className="label" style={{ color: COLORS.white }}>Lorem ipsum</p>
      </Reveal>
      <Reveal delay={0.12} y={40} style={{ position: "absolute", left: r(61), top: top(3951) }}>
        <p className="font-ivy" style={{ fontSize: r(50), lineHeight: r(55), color: COLORS.white, margin: 0 }}>
          Lorem ipsum
          <br />
          dolor sit amet
        </p>
      </Reveal>

      {/* Newsletter capture ---------------------------------------------- */}
      <Reveal delay={0.1} style={{ position: "absolute", left: r(394), top: top(3915), width: r(324) }}>
        <p className="font-inter" style={{ fontSize: r(14), lineHeight: r(20), letterSpacing: r(0.28), color: COLORS.white }}>
          Lorem ipsum dolor sit amet,
          <br />
          ipsum dolor sit amet.
        </p>
      </Reveal>
      <Reveal delay={0.16} style={{ position: "absolute", left: r(397), top: top(3998), width: r(282) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="label" style={{ color: COLORS.white }}>YOUR EMAIL</span>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: r(39), height: r(39), borderRadius: "50%", background: COLORS.purple }}>
            <svg width={r(19)} height={r(12)} viewBox="0 0 19 12" fill="none">
              <path d="M0.5 6h17M13 1l5 5-5 5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div style={{ marginTop: r(11), width: r(282), height: r(2), background: "rgba(255,255,255,0.5)" }} />
      </Reveal>

      {/* Pull-quote ------------------------------------------------------- */}
      <Reveal delay={0.14} style={{ position: "absolute", left: r(1067), top: top(3930), width: r(318) }}>
        <p className="font-arapey" style={{ fontStyle: "italic", fontSize: r(29), lineHeight: 1.15, letterSpacing: r(-0.87), color: COLORS.white, margin: 0 }}>
          Lorem ipsum dolor sit,
          <br />
          amet ipsum dolor.
        </p>
      </Reveal>
      <Reveal delay={0.2} style={{ position: "absolute", left: r(1068), top: top(4025) }}>
        <p className="font-inter" style={{ fontSize: r(14), letterSpacing: r(0.28), color: COLORS.white }}>&mdash; Lorem Ipsum</p>
      </Reveal>

      {/* Bottom row ------------------------------------------------------- */}
      <Reveal delay={0.05} style={{ position: "absolute", left: r(61), top: top(4295) }}>
        <p className="font-inter" style={{ fontSize: r(14), lineHeight: r(30), letterSpacing: r(0.28), color: COLORS.white, fontWeight: 300 }}>
          © 2026 TheNoraEdit  All Rights Reserved
        </p>
      </Reveal>
      <Reveal delay={0.1} style={{ position: "absolute", left: r(397), top: top(4295) }}>
        <div className="font-inter" style={{ display: "flex", gap: r(40), fontSize: r(14), lineHeight: r(30), letterSpacing: r(0.28), color: COLORS.white, fontWeight: 300 }}>
          <span>LinkedIn</span>
          <span>Instagram</span>
          <span>Facebook</span>
        </div>
      </Reveal>
      <Reveal delay={0.14} style={{ position: "absolute", left: r(1067), top: top(4295) }}>
        <div className="font-inter" style={{ display: "flex", gap: r(40), fontSize: r(14), lineHeight: r(30), letterSpacing: r(0.28), color: COLORS.white, fontWeight: 300 }}>
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
        </div>
      </Reveal>
    </Band>
  );
}
