"use client";

import { r, COLORS, fullBleed, gridInner } from "@/lib/px";
import { FadeUp } from "./anim";
import { CreamBackdrop } from '@/components/CreamBlock';
import { useIsMobile } from "./useIsMobile";

/* ---------------------------------------------------------------------------
   ChannelsIntro — a full-bleed navy transition block that sits between the
   cream IntroBlock and the pinned ChannelsCarousel. It contains the heading
   and intro copy for the channels section, creating a clear visual break.
--------------------------------------------------------------------------- */

const SECTION_H = 150; // Section height in design px
const HEADING_TOP = 0; // "Four channels" heading top

export function ChannelsIntro() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 3,
        ...fullBleed,
        height: r(SECTION_H),
        background: COLORS.cream,
        color: "#fff",
      }}
    >
      <CreamBackdrop height={SECTION_H} />

      
    </section>
  );
}


export function ChannelSeparator() {
  const isMobile = useIsMobile();
  return (
    <section
      style={{
        position: "relative",
        zIndex: 3,
        ...fullBleed,
        height: isMobile ? r(50) : r(30),
        background: COLORS.navy,
        color: "#fff",
      }}
    >
    </section>
  );
}