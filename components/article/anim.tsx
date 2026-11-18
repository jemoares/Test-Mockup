"use client";

import { CSSProperties, ReactNode, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { r } from "@/lib/px";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------------------
   Reveal — the workhorse. An element fades in and drifts upward as it scrolls
   into view (the brief's "fade the text up and in on scroll"). `once` so it
   settles and stays; stagger sequences by passing increasing `delay`.
--------------------------------------------------------------------------- */
export function Reveal({
  children,
  style,
  className,
  delay = 0,
  y = 34,
  duration = 0.9,
  amount = 0.4,
  as = "div",
}: {
  children: ReactNode;
  style?: MotionStyle;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
  as?: "div" | "span";
}) {
  const M = as === "span" ? motion.span : motion.div;
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/* ---------------------------------------------------------------------------
   RevealImg — images/video reveal: fade + a slight scale-settle, so media
   "blooms" into place rather than popping. Clips the overshoot with overflow.
--------------------------------------------------------------------------- */
export function RevealImg({
  children,
  style,
  className,
  delay = 0,
  duration = 1.1,
}: {
  children: ReactNode;
  style?: MotionStyle;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden", ...style }}
      initial={{ opacity: 0, scale: 1.08 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   Parallax — scroll-driven vertical drift for depth. `range` (px) is the total
   travel across the element's viewport pass; positive drifts the element up as
   you scroll down. Used on the hero portrait + body collage.
--------------------------------------------------------------------------- */
export function Parallax({
  children,
  range = 60,
  style,
}: {
  children: ReactNode;
  range?: number;
  style?: MotionStyle;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2]);
  return (
    <motion.div ref={ref} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   DrawLine — a hairline/underline that wipes in left→right as it enters view.
   Used for TOC ticks, dividers and the hand-drawn "Join" underline.
--------------------------------------------------------------------------- */
export function DrawLine({
  style,
  delay = 0,
  duration = 0.9,
  origin = "left",
}: {
  style?: MotionStyle;
  delay?: number;
  duration?: number;
  origin?: "left" | "right" | "center";
}) {
  return (
    <motion.div
      style={{ transformOrigin: origin, ...style }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}

/* ---------------------------------------------------------------------------
   Band — a full-bleed horizontal section. The background colour/texture spans
   100% width (bleeds edge-to-edge above 1440) while children sit on the centred
   1440 `.grid`. `rise` makes the band translate up + settle as it scrolls into
   view, so each section "moves up and in over the top of the existing section";
   `overlap` pulls it a few px into the previous band's empty gutter and the
   rising z-index makes it paint over, for a layered, stacked feel.
--------------------------------------------------------------------------- */
export function Band({
  height,
  z,
  background,
  paper = false,
  overlap = 0,
  rise = true,
  rounded = false,
  children,
}: { // Make height optional
  height?: number;
  z: number;
  background: string;
  paper?: boolean;
  overlap?: number;
  rise?: boolean;
  rounded?: boolean;
  children: ReactNode;
}) {
  const base: CSSProperties = {
    position: "relative",
    width: "100%",
    ...(height !== undefined ? { height: r(height) } : { height: 'auto', minHeight: 'fit-content' }), // Allow height to be dynamic if not provided
    background,
    zIndex: z,
    marginTop: overlap ? r(-overlap) : undefined,
    borderTopLeftRadius: rounded ? r(28) : undefined,
    borderTopRightRadius: rounded ? r(28) : undefined,
    boxShadow: overlap ? "0 -40px 80px rgba(11,11,43,0.16)" : undefined,
  };

  const inner = (
    <>
      {/* Paper texture overlay for the light bands (white base + 40% texture). */}
      {paper && (
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
            borderTopLeftRadius: rounded ? r(28) : undefined,
            borderTopRightRadius: rounded ? r(28) : undefined,
          }}
        />
      )}
      <div className="grid">{children}</div>
    </>
  );

  // The band's coloured background stays fixed in the document so the seams
  // between bands are always flush (no gap can open above a band). Only the
  // inner content — paper texture + grid — does the "rise up and in" as the
  // section scrolls into view, settling its contents over the one before it.
  return (
    <section style={base}>
      {rise ? (
        <motion.div
          style={{ position: "relative", width: "100%", height: "100%" }}
          initial={{ y: 56 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {inner}
        </motion.div>
      ) : (
        inner
      )}
    </section>
  );
}

/* ---------------------------------------------------------------------------
   ScrollBadge — the circular "SCROLL TO EXPLORE" wordmark that spins as the
   user scrolls (continuous rotation mapped to window scroll), with the Figma
   asterisk pinned in the centre. Size is the Figma 120px badge.
--------------------------------------------------------------------------- */
export function ScrollBadge({
  asterisk,
  style,
}: {
  asterisk: string;
  style?: CSSProperties;
}) {
  const { scrollY } = useScroll();
  // 1.5 full turns over the first ~3000px of scroll — lively but not frantic.
  const rotate = useTransform(scrollY, [0, 3000], [0, 540]);
  const RING = "SCROLL TO EXPLORE·";

  return (
    <div
      style={{ position: "relative", width: r(120), height: r(120), ...style }}
    >
      <motion.svg
        viewBox="0 0 120 120"
        style={{ width: "100%", height: "100%", rotate, willChange: "transform" }}
        aria-label="Scroll to explore"
      >
        <defs>
          <path
            id="badge-ring"
            d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
          />
        </defs>
        <text
          fill="currentColor"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "11.2px",
            letterSpacing: "1.5px",
          }}
        >
          <textPath href="#badge-ring" startOffset="0" textLength={300} lengthAdjust="spacing">
            {RING}
          </textPath>
        </text>
      </motion.svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asterisk}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: r(30),
          height: r(32),
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
