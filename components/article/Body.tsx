"use client";

import { CSSProperties } from "react";
import { asset } from "@/lib/asset";
import { r, BANDS, COLORS } from "@/lib/px"; // Removed DrawLine as it's not used in the provided snippet
import { Band, Reveal, RevealImg, Parallax } from "@/components/article/anim";
import { useIsMobile } from "@/components/useIsMobile";

const A = (p: string) => asset(`/assets/${p}`);
const O = BANDS.body.offset; // 841 — subtract from Figma-y to get band-relative top
const top = (y: number) => r(y - O);

// Body — band 2 (node 183:4). Navy, white type. Reflowed to carry the full
// Article 1 copy ("The Control Premium") as a flowing left column — drop-cap opener,
// the three patterns, the boardroom quotes and the close — with a table of contents
// and pull-quote on the right rail. The band height (lib/px) is sized to fit the flow.
export function Body({ content }: { content?: any }) {  
  const isMobile = useIsMobile();

  // Shared type styles for the reflowed article body (navy band, white type).
  // On mobile the type is sized with viewport-based clamp() so long-form text
  // auto-fits the screen at a comfortable reading size (16–18px) instead of
  // shrinking with the proportional rem scaler.
  const BODY_FS = isMobile ? "clamp(16px, 4.4vw, 18px)" : r(17);
  const BODY_LH = isMobile ? "1.7" : r(28);
  const pStyle: CSSProperties = {
    fontSize: BODY_FS,
    lineHeight: BODY_LH,
    letterSpacing: r(0.28),
    color: COLORS.white,
    margin: 0,
  };
  const h3Style: CSSProperties = {
    fontSize: isMobile ? "clamp(22px, 6vw, 26px)" : r(30),
    lineHeight: isMobile ? "1.3" : r(40),
    letterSpacing: r(-0.3),
    color: COLORS.white,
    margin: 0,
  };
  const quoteStyle: CSSProperties = {
    fontSize: isMobile ? "clamp(16px, 4.4vw, 18px)" : r(18),
    lineHeight: isMobile ? "1.6" : r(29),
    letterSpacing: r(-0.2),
    color: COLORS.white,
    margin: 0,
    borderLeft: `${r(2)} solid ${COLORS.purple}`,
    paddingLeft: isMobile ? "clamp(12px, 3vw, 16px)" : r(22),
  };
  const attribStyle: CSSProperties = {
    display: "block",
    marginTop: r(10),
    fontSize: isMobile ? "clamp(12px, 3.1vw, 14px)" : r(15),
    lineHeight: isMobile ? "1.5" : r(22),
    letterSpacing: r(1.4),
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  };

  return (
    <Band z={2} background={COLORS.navy}>
      {/* Left article column — flows top-to-bottom ------------------------- */}
      <div
        style={{
          paddingTop: r(100), // Use padding-top instead of absolute top
          paddingLeft: isMobile ? "clamp(18px, 5vw, 24px)" : r(100),
          paddingRight: isMobile ? "clamp(18px, 5vw, 24px)" : undefined,
          width: isMobile ? "100%" : r(700),
          boxSizing: isMobile ? "border-box" : undefined,
          display: "flex",
          flexDirection: "column",
          paddingBottom: r(100),
          gap: isMobile ? r(60) : r(32),
        }}
      >
        {/* Drop-cap opener */}
        {content?.sections.map((section: any, index: any) => (
          <Reveal key={index} delay={section.type === "heading" ? 0.04 : 0}>
            {section.type === "paragraph" && (
              <p className="font-inter" style={pStyle}>
                {section.dropCap && (
                  <span
                    className="font-arapey"
                    style={{
                      float: "left",
                      fontSize: isMobile ? "clamp(52px, 15vw, 68px)" : r(82),
                      lineHeight: isMobile ? "clamp(46px, 13vw, 60px)" : r(60),
                      paddingRight: r(20),
                      paddingTop: r(6),
                      color: COLORS.white,
                    }}
                  >
                    {section.dropCap}
                  </span>
                )}
                <span dangerouslySetInnerHTML={{ __html: section.content || "" }} />
              </p>
            )}
            {section.type === "video" && section.src && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  backgroundColor: "#000",
                }}
              >
                <iframe
                  src={section.src}
                  title={section.title || "Birdeye podcast"}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </div>
            )}
{/* Inline article images with captions */}
{section.type === "image" &&
  section.src &&
  section.layout === "inline" && (
    <figure
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: r(12),
      }}
    >
      <img
        src={A(section.src)}
        alt={section.alt || ""}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />

      {section.caption && (
        <figcaption
          className="font-inter"
          style={{
            fontSize: isMobile
              ? "clamp(12px, 3.1vw, 14px)"
              : r(13),
            lineHeight: isMobile ? "1.5" : r(20),
            letterSpacing: r(0.26),
            color: "rgba(255,255,255,0.75)",
            margin: 0,
          }}
        >
          {section.caption}
        </figcaption>
      )}
    </figure>
  )}

{/* Existing right-rail images for other articles */}
{!isMobile &&
  section.type === "image" &&
  section.src &&
  section.layout !== "inline" && (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: r(600),
        left: r(800),
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: r(500),
          height: r(351),
          border: `1px solid ${COLORS.white}`,
          marginTop: r(10),
          marginBottom: r(10),
          position: "relative",
        }}
      >
        <img
          src={A(section.src)}
          alt={section.alt || ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {section.quote && (
        <div
          style={{
            position: "relative",
            marginTop: r(20),
            marginBottom: r(20),
            width: r(400),
          }}
        >
          <p
            className="font-ivy"
            style={{
              fontSize: r(18),
              lineHeight: r(26),
              color: COLORS.white,
              margin: 0,
            }}
          >
            &ldquo;In a system shaped by platforms, partners and
            intelligent machines, control is becoming the premium.&rdquo;
          </p>
        </div>
      )}
    </div>
  )}
            {section.type === "heading" && section.content && (
              <div>
                {section.marker && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={A(section.marker)} alt="" style={{ width: r(50), height: r(10.126), display: "block", marginBottom: r(14) }} />
                )}
                <h3 className="font-ivy" style={h3Style}>
                  {section.content}
                </h3>
              </div>
            )}
            {section.type === "quote" && section.content && (
              <p className="font-ivy" style={quoteStyle}>
                <span dangerouslySetInnerHTML={{ __html: section.content }} />
                {section.attribution && (
                  <span
                    className="font-inter"
                    style={attribStyle}
                    dangerouslySetInnerHTML={{ __html: section.attribution }}
                  />
                )}
              </p>
            )}
            {section.type === "list" && section.items && (
              <div>
                {section.title && (
                  <p
                    className="font-inter"
                    style={{
                      fontSize: isMobile ? "clamp(17px, 4.6vw, 20px)" : r(19.8),
                      lineHeight: BODY_LH,
                      color: COLORS.white,
                      width: isMobile ? "100%" : r(700),
                      margin: 0,
                      marginBottom: r(16),
                    }}
                  >
                    {section.title}
                  </p>
                )}
                <ul
                  className="font-inter"
                  style={{
                    fontSize: BODY_FS,
                    lineHeight: BODY_LH,
                    color: COLORS.white,
                    width: isMobile ? "100%" : r(700),
                    margin: 0,
                    paddingLeft: "3%",
                  }}
                >
                  {section.items.map((item: string, itemIndex: number) => <li key={itemIndex} className="font-inter" dangerouslySetInnerHTML={{ __html: item }} />)}
                </ul>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </Band>
  );
}