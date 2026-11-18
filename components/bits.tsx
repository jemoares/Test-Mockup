import { asset } from "@/lib/asset";
import { CSSProperties } from "react";
import { r } from "@/lib/px";
import Link from "next/link";

// Clean horizontal arrow (→), drawn inline so it can never distort. Inherits the
// surrounding text color via currentColor (white in dark sections, black on the
// paper/channels). Replaces the Figma `preserveAspectRatio="none"` arrow SVGs,
// which stretched vertically when given height:auto.
export function Arrow({
  width = 22,
  style,
  className,
  isMobile,
}: {
  width?: number;
  style?: CSSProperties;
  className?: string;
  isMobile?: boolean;
}) {
  const height = (width * 10) / 24;
  return (
    <svg
      className={className}
      style={style}
      width={isMobile ? r(70) : r(width)}
      height={isMobile ? r(70) : r(height)}
      viewBox="0 0 24 10"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 5H22M18 1L22 5L18 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// "READ ARTICLE →" link. Arrow slides on hover (see .read-link in globals.css).
export function ReadLink({
  label = "READ ARTICLE",
  color = "#fff",
  href = "#",
  style,
  onClick,
  isMobile,
}: {
  label?: string;
  color?: string;
  href?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  isMobile?: boolean;
}) {
  return (
    <Link className="read-link label" href={href} style={{ color, ...style }} onClick={onClick}>
      {label}
      <Arrow className="arrow" isMobile={isMobile}  />
    </Link>
  );
}

// A decorative SVG accent (scribbles / underlines), placed by Figma coordinates.
export function Accent({
  src,
  left,
  top,
  width,
  height,
  rotate = 0,
  opacity = 1,
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <img
      src={asset(`/assets/${src}.svg`)}
      alt=""
      aria-hidden
      style={{
        position: "absolute",
        left: r(left),
        top: r(top),
        width: r(width),
        height: r(height),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

export function AccentGIF({
  src,
  left,
  top,
  width,
  height,
  rotate = 0,
  opacity = 1,
}: {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <img
      src={asset(`/assets/${src}.gif`)}
      alt=""
      aria-hidden
      style={{
        position: "absolute",
        left: r(left),
        top: r(top),
        width: r(width),
        height: r(height),
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
