"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
  type EasingFunction,
  type Easing,
  type MotionValue,
  // Import specific easing functions from framer-motion
  easeIn,
  easeOut,
  easeInOut,
  anticipate,
  backIn,
  backOut,
  backInOut,
  circIn,
  circOut,
  circInOut,
  cubicBezier, // For array-based easings
  steps, // For steps easing
} from "framer-motion";
import { r } from "@/lib/px";
import { useIsMobile } from "@/components/useIsMobile";

/* ---------------------------------------------------------------------------
   FadeUp — element fades in and drifts upward as it scrolls into view.
   Used for the scattered paper-section collage tiles (one-by-one, organic),
   captions, hand-written notes and the channel cards.
--------------------------------------------------------------------------- */
export function FadeUp({
  children,
  style,
  delay = 0,
  y = 48,
  duration = 3.0,
  amount = 0.3,
}: {
  children: ReactNode;
  style?: MotionStyle;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
}) {
  return (
    <motion.div
      style={style}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0 },
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   useScrollScale — the current layout scale (1 at ≥1440px wide, <1 below), kept
   in sync with the root font-size set by the rem scaler in globals.css. Lets the
   scroll-reveal windows below be authored in 1440-canvas design px and still line
   up with the proportionally-scaled layout on smaller viewports.
--------------------------------------------------------------------------- */
export function useScrollScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const recompute = () => {
      const fs =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setScale(fs / 16);
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);
  return scale;
}

/**
 * Helper function to resolve Easing string literals or arrays to EasingFunctions.
 * This is necessary because useTransform's options.ease expects EasingFunction directly,
 * even though the Easing type includes string literals.
 */
function resolveEasingFunction(ease: Easing): EasingFunction {
  if (typeof ease === "string") {
    switch (ease) {
      case "easeIn": return easeIn;
      case "easeOut": return easeOut;
      case "easeInOut": return easeInOut;
      case "anticipate": return anticipate;
      case "backIn": return backIn;
      case "backOut": return backOut;
      case "backInOut": return backInOut;
      case "circIn": return circIn;
      case "circOut": return circOut;
      case "circInOut": return circInOut;
      // Add other string easings as needed if they are used in the 'ease' prop
      default:
        console.warn(`Unknown easing string: ${ease}. Falling back to easeInOut.`);
        return easeInOut;
    }
  } else if (Array.isArray(ease) && ease.length === 4) {
    // Assume it's a cubic bezier array [x1, y1, x2, y2]
    return cubicBezier(ease[0], ease[1], ease[2], ease[3]);
  }
  // If it's already an EasingFunction, or an unsupported type, return as is.
  return ease as EasingFunction;
}

function resolveEasingFunctions(ease: Easing | Easing[]): EasingFunction | EasingFunction[] {
  if (Array.isArray(ease)) {
    return ease.map(resolveEasingFunction);
  }
  return resolveEasingFunction(ease);
}

/* ---------------------------------------------------------------------------
   ScrollReveal — fades an element up + in as a function of the window scroll
   position, over a design-px window [from, to] (scaled to real px). Used to build
   the hero / section-two copy one element at a time as the user scrolls, instead
   of all at once on load: give each element a later, slightly-overlapping window
   and they reveal in sequence.
--------------------------------------------------------------------------- */
export function ScrollReveal({
  scrollY,
  scale,
  from,
  to,
  lift = 26,
  style,
  children, 
  ease = "easeInOut", // Added ease prop with a default value
}: {
  scrollY: MotionValue<number>;
  scale: number;
  from: number; // scroll (design px) where this element starts revealing
  to: number; // scroll (design px) where it is fully in
  lift?: number; // how far it drifts up while fading in (real px)
  style?: MotionStyle;
  children: ReactNode;
  ease?: Easing | Easing[]; // Added ease to the prop type
}) {
  const range: [number, number] = [from * scale, to * scale];
  const resolvedEase = resolveEasingFunctions(ease); // Resolve easing here
  const opacity = useTransform(scrollY, range, [0, 1], { clamp: true, ease: resolvedEase });
  const y = useTransform(scrollY, range, [lift, 0], { clamp: true, ease: resolvedEase });
  return (
    <motion.div
      style={{ ...style, opacity, y, willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   ScrollLetters — reveals a line of text letter-by-letter, scrubbed to scroll
   progress (used for "Ideas. Culture. Perspective."). Letters sit faintly
   ghosted and ink-in as the heading travels up through the viewport.
--------------------------------------------------------------------------- */
export function ScrollLetters({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  const chars = Array.from(text);

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {chars.map((ch, i) => (
        <Letter
          key={i}
          ch={ch}
          start={(i / chars.length) * 0.7}
          end={(i / chars.length) * 0.7 + 0.25}
          progress={scrollYProgress}
        />
      ))}
    </p>
  );
}

function Letter({
  ch,
  start,
  end,
  progress,
}: {
  ch: string;
  start: number;
  end: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }}>
      {ch === " " ? " " : ch}
    </motion.span>
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
  size = 120,
  onClick,
}: {
  asterisk: string;
  style?: CSSProperties;
  size?: number;
  onClick?: () => void;
}) {
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();
  // Continuous rotation: 0.18 degrees per pixel, based on the original "1.5 full turns over the first ~3000px of scroll" speed.
  const rotate = useTransform(scrollY, (latest) => latest * (540 / 3000));
  const RING = "SCROLL TO EXPLORE";
  const finalSize = isMobile ? size * 2 : size;

  if(isMobile){
    return;
  }

  return (
    <motion.div
      style={{
        position: "fixed", // Changed to fixed
        bottom: r(40),    // Positioned at the bottom
        right: r(40),     // Positioned at the right
        zIndex: 999,      // Ensure it's always on top
        width: r(finalSize),
        height: r(finalSize),
        cursor: onClick ? "pointer" : undefined,
        ...style, // Apply any additional styles passed in
        color: "white"
      }}
      onClick={onClick}
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
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "1.5px",
          }}
        >
          <textPath href="#badge-ring" startOffset="0" textLength={180} lengthAdjust="spacing">
            {RING}
          </textPath>
        </text>
      </motion.svg>
      <img
        src={asterisk}
        alt=""
        aria-hidden
        style={{ position: "absolute", left: "50%", top: "50%", width: r(isMobile ? 82.5 : 55), height: r(isMobile ? 82.5 : 55), transform: "translate(-50%, -50%)" }}
      />
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   FadeIn — simple opacity/translate intro used for the nav on first paint.
--------------------------------------------------------------------------- */
export function FadeIn({
  children,
  style,
  delay = 0,
  y = -10,
  duration = 0.8,
}: {
  children: ReactNode;
  style?: MotionStyle;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
