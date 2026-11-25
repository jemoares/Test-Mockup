"use client";

import { asset } from "@/lib/asset";
import { r, BANDS, COLORS } from "@/lib/px";
import { Band, Reveal, RevealImg, Parallax, ScrollBadge } from "@/components/article/anim"; // Removed DrawLine as it's not used in the provided snippet
import { useIsMobile } from "@/components/useIsMobile";
import { useRouter } from "next/navigation";
import { useBackLabel } from "@/lib/useBackLabel";

const A = (p: string) => asset(`/assets/${p}`);

// Hero — band 1 (node 183:3). White + paper-texture, black type. The headline is
// Arapey 110 with an italic "Essential"; the portrait (top-right) is a zoomed crop
// of the phone-collage clip, drifting with a touch of parallax.
export function Hero({ content }: { content: any }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const backLabel = useBackLabel(false);
  const { height } = BANDS.hero;

  return (
    <Band
      height={isMobile ? undefined : (content.hero.heroHeight ?? height)}
      z={1}
      background={COLORS.paper}
      paper
      rise={false}
    >
    {/* Back to articles ------------------------------------------------ */}
      <Reveal delay={0.12} style={{ position: "relative", left: isMobile ? r(40) : r(60), top: isMobile ? r(50) : r(50) }}>
        <button className="arrow-link back" onClick={() => {
        const params = new URLSearchParams(window.location.search);

        // Keep existing behavior for channel navigation
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }} style={{ gap: r(24), background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="arrow" src={A("arrow-back.svg")} alt="" style={{ width: isMobile ? r(25) : r(16), 
              height: isMobile ? r(20) : r(9), transform: "rotate(180deg)" }} />
          <span className="label" style={{ fontSize: isMobile ? r(35) : r(10), color: COLORS.black }}>Back to {backLabel}</span>
        </button>
      </Reveal>

      {/* Headline ------------------------------------------------------- */}
      <Reveal
        delay={0.3}
        y={40}
        style={isMobile ? {
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          paddingLeft: "clamp(18px, 5vw, 24px)",
          paddingRight: "clamp(18px, 5vw, 24px)",
          paddingTop: r(120),
        } : { position: "absolute", left: r(100), top: r(130), width: r(647) }}
      >
        <h1
          className="font-arapey"
          style={{ 
            fontSize: isMobile ? "clamp(24px, 6vw, 32px)" : r(65), 
            lineHeight: isMobile ? "1.15" : r(60), 
            letterSpacing: r(-2.2), 
            color: COLORS.black, 
            margin: 0 
          }} // Using dangerouslySetInnerHTML for headline to allow `<span>` tags
          dangerouslySetInnerHTML={{ __html: content.hero.headline }}
        >
        </h1>
        <br/>
        <p className="font-inter" style={{ 
          fontSize: isMobile ? "clamp(15px, 4vw, 18px)" : r(20), 
          lineHeight: isMobile ? "1.5" : r(30), letterSpacing: r(0.4), color: COLORS.black, marginTop: r(15) }}>
          <span dangerouslySetInnerHTML={{ __html: content.hero.subtitle }} />
        </p>
        <br/>
        {Array.isArray(content.hero.speakers) && content.hero.speakers.length > 0 ? (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: isMobile ? "8vw" : r(56),
      marginTop: r(15),
    }}
  >
    {content.hero.speakers.map((speaker: any, index: number) => (
      <RevealImg
        key={speaker.image || index}
        delay={0.15 + index * 0.1}
        duration={1.2}
        style={{
          position: "relative",
          width: isMobile ? "min(39vw, 195px)" : r(180),
          height: isMobile ? "min(39vw, 195px)" : r(180),
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img
          src={A(speaker.image)}
          alt={speaker.name || ""}
          title={speaker.role || ""}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform:
              speaker.image === "jono-spragg.jpg"
                ? "translateY(20px) scale(1.8)"
                : "none",
            transformOrigin: "50% 20%",
          }}
        />
      </RevealImg>
    ))}
  </div>
      ) : content.hero.portrait ? (
        <RevealImg
          delay={0.15}
          duration={1.2}
          style={{
            position: "relative",
            left: r(0),
            top: r(0),
            width: isMobile ? r(220) : r(180),
            height: isMobile ? r(220) : r(180),
            borderRadius: "50%",
            overflow: "hidden",
            marginTop: r(15),
          }}
        >
          <img
            src={A(content.hero.portrait)}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </RevealImg>
      ) : null}
        {content.hero.byline && (
          <>
            <br/>
          {/* Speaker byline */}
            {content.hero.byline && (
              <p
                className="font-inter"
                style={{
                  fontSize: isMobile ? "clamp(13px, 3.6vw, 16px)" : r(15.619),
                  lineHeight: isMobile ? "1.5" : r(33.47),
                  letterSpacing: r(0.312),
                  color: COLORS.black,
                  marginTop: r(15),
                }}
              >
                {content.hero.byline}
              </p>
            )}

            {/* Collaboration brand */}
            {content.hero.collabBrand && (
              <p
                className="font-inter"
                style={{
                  fontSize: isMobile ? "clamp(13px, 3.6vw, 16px)" : r(15.619),
                  lineHeight: isMobile ? "1.5" : r(25),
                  letterSpacing: r(0.312),
                  color: COLORS.black,
                  marginTop: r(18),
                }}
              >
                {content.hero.collabBrand}
              </p>
            )}

            {/* Webinar button */}
            {content.hero.webinarButton && (
              <a
                href={content.hero.webinarButton.url || "#"}
                className="font-inter"
                style={{
                  display: "inline-block",
                  alignSelf: "flex-start",
                  marginTop: r(18),
                  backgroundColor: "#9824AE",
                  color: "#FFFFFF",
                  borderRadius: r(50),
                  padding: isMobile ? "10px 24px" : "10px 32px",
                  fontSize: isMobile ? "clamp(12px, 2.8vw, 16px)" : r(19),
                  lineHeight: r(24),
                  letterSpacing: r(0.7),
                  textTransform: "uppercase",
                  textDecoration: "none",
                  whiteSpace: isMobile ? "normal" : "nowrap",
                }}
              >
                {content.hero.webinarButton.label}
              </a>
            )}
          </>
        )}
        {content.hero.meta && (
          <>
            <br/>
            <p className="font-inter" style={{ 
              fontSize: isMobile ? "clamp(12px, 3.2vw, 14px)" : r(13.388), 
              lineHeight: isMobile ? "1.5" : r(33.47), letterSpacing: r(0.268), color: COLORS.black, whiteSpace: isMobile ? "normal" : "nowrap", marginTop: r(15) }}>
              {content.hero.meta}
            </p>
          </>
        )}
      </Reveal>

      {/* Hero image — stacked below the text on mobile, full-bleed so it fits the sides. */}
      {isMobile ? (
        <div style={{ width: "100%", marginTop: r(50) }}>
          {content.hero.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={A(content.hero.heroImage)}
              alt={content.hero.videoAlt || ""}
              style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
            />
          ) : content.hero.videoWebm || content.hero.videoMp4 ? (
            <video autoPlay muted loop playsInline preload="auto" style={{ width: "100%", height: "auto", display: "block" }}>
              {content.hero.videoWebm && <source src={A(content.hero.videoWebm)} type="video/webm" />}
              {content.hero.videoMp4 && <source src={A(content.hero.videoMp4)} type="video/mp4" />}
            </video>
          ) : (
            <div
              role="img"
              aria-label="Hero image placeholder"
              style={{
                width: "100%",
                aspectRatio: "390 / 584",
                background: "#D9D5CB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: r(12),
                color: "rgba(11,11,47,.55)",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: r(12),
                fontWeight: 700,
                letterSpacing: r(2),
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="1" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <path d="M3 17l5-5 4 4 3-3 6 6" />
              </svg>
              <span>Hero image placeholder</span>
            </div>
          )}
        </div>
      ) : (
        <RevealImg
          delay={0.15}
          duration={1.2}
          style={{
            position: "absolute",
            left: r(843),
            top: r(139),
            bottom: r(0),
            width: r(536),
            height: undefined,
          }}
        >
          {/* Only the fixed RevealImg frame clips (overflow:hidden). The inner box
              stays overflow:visible so the parallax drift is absorbed by the video's
              generous off-frame bleed instead of exposing the frame's bottom edge.
              range is kept within that bleed (±10px) so no edge is ever revealed. */}
          <Parallax range={0} style={{ width: "100%", height: "100%" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>
              {content.hero.heroImage ? (
                <img
                  src={A(content.hero.heroImage)}
                  alt={content.hero.videoAlt || ""}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                    display: "block",
                  }}
                />
              ) : content.hero.videoWebm || content.hero.videoMp4 ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{
                    position: "absolute",
                    width: r(1360),
                    height: r(763),
                    left: r(-411.9),
                    top: r(-10),
                    objectFit: "cover",
                  }}
                >
                  {content.hero.videoWebm && <source src={A(content.hero.videoWebm)} type="video/webm" />}
                  {content.hero.videoMp4 && <source src={A(content.hero.videoMp4)} type="video/mp4" />}
                </video>
              ) : (
                <div
                  role="img"
                  aria-label="Hero image placeholder"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#D9D5CB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: r(12),
                    color: "rgba(11,11,47,.55)",
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: r(12),
                    fontWeight: 700,
                    letterSpacing: r(2),
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="1" />
                    <circle cx="8.5" cy="9.5" r="1.5" />
                    <path d="M3 17l5-5 4 4 3-3 6 6" />
                  </svg>
                  <span>Hero image placeholder</span>
                </div>
              )}
            </div>
          </Parallax>
        </RevealImg>
      )}
    </Band>
  );
}


export function Hero2({ content }: { content: any }) {
  const router = useRouter();
  const { height } = BANDS.hero;

  return (
    <Band height={height} z={1} background={COLORS.paper} paper rise={false}>

      {/* Back to articles ------------------------------------------------ */}
      <Reveal delay={0.12} style={{ position: "absolute", left: r(60), top: r(156) }}>
        <button className="arrow-link back" onClick={() => {
          if (window.history.length > 1) router.back();
          else router.push("/");
        }} style={{ gap: r(24), background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="arrow" src={A("arrow-back.svg")} alt="" style={{ width: r(16), height: r(9), transform: "rotate(180deg)" }} />
          <span className="label" style={{ color: COLORS.black }}>Back to Articles</span>
        </button>
      </Reveal>

      {/* Category ------------------------------------------------------- */}
      <Reveal delay={0.2} style={{ position: "absolute", left: r(100), top: r(241) }}>
        <p className="font-inter" style={{ fontSize: r(14), letterSpacing: r(0.28), lineHeight: r(30), color: COLORS.black }} dangerouslySetInnerHTML={{ __html: content.hero.category }}>
        </p>
      </Reveal>

      {/* Headline ------------------------------------------------------- */}
      <Reveal delay={0.3} y={40} style={{ position: "absolute", left: r(100), top: r(302), width: r(647) }}>
        <h1
          className="font-arapey"
          style={{ fontSize: r(80), lineHeight: r(70), letterSpacing: r(-2.2), color: COLORS.black, margin: 0 }} // Using dangerouslySetInnerHTML for headline to allow `<span>` tags
          dangerouslySetInnerHTML={{ __html: content.hero.headline }}
        >
        </h1>

        <p className="font-inter" style={{ fontSize: r(20), lineHeight: r(30), letterSpacing: r(0.4), color: COLORS.black, marginTop: r(10) }}>
          <span dangerouslySetInnerHTML={{ __html: content.hero.subtitle }} />
        </p>
      </Reveal>

      {/* Byline + meta -------------------------------------------------- */}
      <Reveal delay={0.55} style={{ position: "absolute", left: r(100), top: r(629) }}>
        <p className="font-inter" style={{ fontSize: r(15.619), lineHeight: r(33.47), letterSpacing: r(0.312), color: COLORS.black }}>
          {content.hero.byline}
        </p>
      </Reveal>
      <Reveal delay={0.62} style={{ position: "absolute", left: r(100), top: r(659) }}>
        <p className="font-inter" style={{ fontSize: r(13.388), lineHeight: r(33.47), letterSpacing: r(0.268), color: COLORS.black, whiteSpace: "nowrap" }}>
          {content.hero.meta}
        </p>
      </Reveal>

      {/* Spinning "scroll to explore" badge (Figma node 210:22) — black ring
          text on the paper hero, blue asterisk centre; spins as the user scrolls. */}
      <Reveal delay={0.5} style={{ position: "absolute", left: r(677), top: r(682), color: COLORS.black }}>
        <ScrollBadge asterisk={A("badge-asterisk.svg")} />
      </Reveal>

      {/* Hero portrait — zoomed crop of the collage clip ----------------- */}
      {/* height runs a few px past the band's 841 seam so the bottom is flush with
          the navy (no cream sliver); the overflow tucks under the navy band (z:2). */}
      <RevealImg
        delay={0.15}
        duration={1.2}
        style={{ position: "absolute", left: r(843), top: r(138), width: r(536), height: r(705) }}
      >
        {/* Only the fixed RevealImg frame clips (overflow:hidden). The inner box
            stays overflow:visible so the parallax drift is absorbed by the video's
            generous off-frame bleed instead of exposing the frame's bottom edge.
            range is kept within that bleed (±10px) so no edge is ever revealed. */}
        <Parallax range={20} style={{ width: "100%", height: "100%" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>
            {content.hero.heroImage ? (
              <img
                src={A(content.hero.heroImage)}
                alt={content.hero.videoAlt || ""}
                style={{
                  position: "absolute",
                  width: r(1360),
                  height: r(763),
                  left: r(-411.9),
                  top: r(-10),
                  objectFit: "cover",
                }}
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  position: "absolute",
                  width: r(1360),
                  height: r(763),
                  left: r(-411.9),
                  top: r(-10),
                  objectFit: "cover",
                }}
              >
                <source src={A(content.hero.videoWebm)} type="video/webm" />
                <source src={A(content.hero.videoMp4)} type="video/mp4" />
              </video>
            )}
          </div>
        </Parallax>
      </RevealImg>
    </Band>
  );
}
