// The whole site is authored on the Figma 1440px canvas. Every dimension below is the
// exact Figma pixel value; `r()` converts it to rem so the global root-font-size scaler
// in globals.css can shrink the entire layout proportionally on smaller viewports while
// keeping it pixel-identical to the design at 1440px wide.
export const r = (px: number): string => `${px / 16}rem`;

// Full-bleed (edge-to-edge / 100vw) for a section whose containing block is the 1440
// `.canvas`. `50%` resolves against the 1440 canvas, `50vw` against the viewport, so the
// section is re-centred on the viewport and spans its full width — even above 1440px where
// the canvas is otherwise centred with cream margins. No transform (keeps `position:sticky`
// clean on the dark sections). Below 1440px the canvas already === 100vw so this is a no-op.
export const fullBleed = {
  width: "100vw",
  marginLeft: "calc(50% - 50vw)",
} as const;

// The 1440 design grid, re-centred inside a now-100vw section. Wrap a full-bleed section's
// positioned content in this so every Figma `left:r(x)` offset stays on the centred grid
// while the section background bleeds behind it.
export const gridInner = {
  position: "absolute",
  left: "50%",
  top: 0,
  transform: "translateX(-50%)",
  width: r(1440),
  height: "100%",
} as const;

// Figma canvas + section geometry (px). Used to lay sections out and offset their children.
export const HERO_H = 898; // dark hero (TV scene)
export const S2_H = 977; // dark full-bleed (phones / portrait)
export const FOOTER_H = 612;

// Brand palette pulled straight from the Figma file.
export const COLORS = {
  cream: "#eae5d9",
  navy: "#0B0B2F",
  navy1: "#06061a",
  paper: "#ffffff",
  white: "#ffffff",
  black: "#000000",
  blue: "#003BFF", // comment post avatar (literal in the Figma export)
  purple: "#CD51FF", // email submit buttons (sampled from the hi-res render)
  iris: "#9020A9"
};

export const BANDS = {
  hero: { offset: 0, height: 841 }, // paper/white hero (node 183:3)
  body: { offset: 841, height: 2200 }, // navy body (node 183:4) — heightened for the reflowed full Article 1 copy + collage clip
  conversation: { offset: 2408, height: 1200 }, // paper "Join the Conversation" (node 183:5)
  footer: { offset: 3810, height: 612 }, // navy footer (node 183:205)
} as const;
