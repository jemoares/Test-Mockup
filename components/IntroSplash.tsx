"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { r } from "@/lib/px";
import { AccentGIF, ReadLink } from "./bits";
import { useIsMobile } from "./useIsMobile";

/* ---------------------------------------------------------------------------
   IntroSplash — the "the nora edit" wordmark animation (nora-edit-3.gif, converted
   to a non-looping mp4/webm) covers the screen on landing, plays, holds briefly,
   then slowly fades out to reveal the hero beneath.

   ▼▼▼ TIMING KNOBS — edit these three numbers to retune the intro ▼▼▼

   The clip's motion finishes at ~1.9s, then it holds on the finished wordmark.
   We start the fade at MOTION_ENDS_MS + DEAD_HOLD_MS, so:

     • DEAD_HOLD_MS  — how long the finished wordmark sits still before it starts
                       fading out. THIS is the "dead hold". Bigger = longer pause,
                       smaller (even 0) = it fades the instant the motion settles.
     • FADE_MS       — how long the cross-fade from wordmark → hero takes.
     • MOTION_ENDS_MS — when the clip's motion finishes (fixed by the GIF itself,
                        ~1900ms for the current nora-edit-3 clip). Only change this
                        if you re-time/replace the GIF and its motion ends elsewhere.
--------------------------------------------------------------------------- */
const DEAD_HOLD_MS = 600;
const FADE_MS = 1600;
const MOTION_ENDS_MS = 1960;
const IMAGE_FADE_IN_MS = 500;

export function IntroSplash() {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<"initializing" | "playing" | "image" | "fading" | "done">("initializing");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const itemStr = localStorage.getItem("hasSeenIntroSplash");

    if (!itemStr) {
      setPhase("playing");
      return;
    }

    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();

      if (now > item.expiry) {
        localStorage.removeItem("hasSeenIntroSplash");
        setPhase("playing");
      } else {
        setPhase("done");
      }
    } catch (e) {
      // If parsing fails, default to playing the intro
      localStorage.removeItem("hasSeenIntroSplash");
      setPhase("playing");
    }
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0b0b2b", // COLORS.navy
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        pointerEvents: phase !== "playing" ? "auto" : "none",
      }}
      onTransitionEnd={() => {
        if (phase === "fading") {
          setPhase("done");
        }
      }}
    >
      {phase === "playing" && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setTimeout(() => setPhase("image"), DEAD_HOLD_MS)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: isMobile ? "contain" : "cover",
            transform: isMobile ? "scale(2.5)" : "none",
            display: "block",
            backgroundColor: "white" }}
        >
          <source src={asset("/assets/nora-edit-4.mp4")} type="video/mp4" />
        </video>
      )}
      {phase === "image" && (
        <>
          <style>{`
              @keyframes fadeIn {
                from { opacity: 0; } to { opacity: 1; }
              }
            `}</style>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: "white",
              padding: isMobile ? "0 2rem" : 0,
              boxSizing: "border-box",
              animation: `fadeIn ${IMAGE_FADE_IN_MS}ms ease-in`,
            }}
          >
            <img
              src={asset("/assets/NOR0001 theNORAedit_LOGO_BLACK_RGB.svg")}
              alt="The NORA Edit Logo"
              style={{
                width: isMobile ? r(1000) : r(500),
                marginBottom: isMobile ? r(20) : "1rem",
              }}
            />
            <img
              src={asset(`/assets/accent-intro-divider.svg`)}
              alt=""
              aria-hidden
              style={{
                position: "relative",
                top: isMobile ? r(-10) : r(-10),
                left: isMobile ? r(-25) : r(-15),
                width: isMobile ? r(440) : r(220),
                height: isMobile ? r(20) : r(11),
                marginBottom: isMobile ? r(40) : r(10),
                pointerEvents: "none",
              }}
            />
            <p
              className="font-ivy"
              style={{
                fontSize: isMobile ? r(65) : r(27.5),
                lineHeight: isMobile ? r(80) : r(33),
                fontWeight: 400,
                color: "#000",
                textAlign: "center",
                marginBottom: isMobile ? "4rem" : "3rem",
              }}
            >
              The NORA Edit is a curated selection of thought-provoking
              {isMobile ? <></> : <br />}
              {" "}and consequential pieces from across the retail industry, 
              {isMobile ? <></> : <br />}
              {" "}refined by NORA's advisors and editorial team to ensure you have access
              {isMobile ? <></> : <br />}
              {" "}to content that steers leadership.
            </p>
            {/* <button
              onClick={() => setPhase("fading")}
              className="font-ivy"
              style={{
                background: "transparent",
                border: "1px solid black",
                color: "black",
                padding: "1rem 2rem",
                fontSize: "1.5rem",
                cursor: "pointer",
                borderRadius: "50px",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "black";
              }}
            >
              Enter
            </button> */}
            <ReadLink
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day
                const item = {
                  value: true,
                  expiry: expiry,
                };
                localStorage.setItem("hasSeenIntroSplash", JSON.stringify(item));
                setPhase("fading");
              }}
              label="Enter" color="#000" style={{ fontSize: isMobile ? r(60) : r(27.5), position: "relative", left: 0, top: isMobile ? r(30) : r(18) }} isMobile={isMobile} />
            <img
              src={asset(`/assets/NOR0001_Swiggle2-Eblue_1080x1080PX.gif`)}
              alt=""
              aria-hidden
              style={{
                position: "relative",
                top: isMobile ? r(-180) : r(-100),
                left: isMobile ? r(-50) : r(-20),
                width: isMobile ? r(600) : r(250),
                height: isMobile ? r(350) : r(200),
                pointerEvents: "none",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
