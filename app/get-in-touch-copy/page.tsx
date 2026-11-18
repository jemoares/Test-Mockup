"use client";

import { asset } from "@/lib/asset";
import { r, COLORS, fullBleed } from "@/lib/px";
import { CSSProperties } from "react";
import { useIsMobile } from "@/components/useIsMobile";

export default function GetInTouchPage() {
  const isMobile = useIsMobile();
  const style = {
    "--paper-tex": `url(${asset("/assets/paper-texture.jpg")})`,
    ...fullBleed,
  } as CSSProperties;

  return (
    <div style={style}>
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: COLORS.white,
        }}
      >
        {/* Paper texture overlay, mirroring the article bands (40% opacity). */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "var(--paper-tex)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        {/* Back link, consistent with the article hero. */}
        <div style={{ position: "absolute", left: isMobile ? r(50) : r(60), top: isMobile ? r(50) : r(50), width: "fit-content", zIndex: 2 }}>
          <a className="arrow-link back" href={asset("/")} style={{ gap: isMobile ? r(30) : r(24) }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="arrow"
              src={asset("/assets/arrow-back.svg")}
              alt=""
              style={{ width: isMobile ? r(40) : r(16), height: isMobile ? r(25) : r(9), transform: "rotate(180deg)" }}
            />
            <span className="label" style={{ fontSize: isMobile ? r(25) : r(10), color: COLORS.black }}>
              Back to NORA Edit
            </span>
          </a>
        </div>

        {/* Centred content. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? r(60) : r(30),
            minHeight: "100vh",
            paddingLeft: isMobile ? r(60) : r(40),
            paddingRight: isMobile ? r(60) : r(40),
            paddingTop: isMobile ? r(200) : 0,
            textAlign: "center",
          }}
        >
          <h1
            className="font-arapey"
            style={{
              fontSize: isMobile ? r(100) : r(60),
              lineHeight: isMobile ? r(105) : r(68),
              letterSpacing: r(-1.5),
              color: COLORS.black,
              margin: 0,
              maxWidth: isMobile ? r(680) : r(900),
            }}
          >
            Would you like to collaborate with us?
          </h1>

          <p
            className="font-inter"
            style={{
              fontSize: isMobile ? r(42) : r(20),
              lineHeight: isMobile ? r(55) : r(30),
              color: COLORS.black,
              margin: 0,
            }}
          >
            Contact the Collaborations Team:{" "}
            <a
              href="mailto:Collaborations@nora.org.au"
              className="font-inter"
              style={{ color: COLORS.black, textDecoration: "underline" }}
            >
              Collaborations@nora.org.au
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}