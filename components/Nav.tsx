"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { r, COLORS, fullBleed } from "@/lib/px";
import { FadeIn } from "./anim";
import { useOnClickOutside } from "@/components/useOnClickOutside";
import { CHANNELS, MONDAY_FORM } from "@/lib/constants";
import { useIsMobile } from "./useIsMobile";

// Top navigation: logo wordmark left, MENU + 4-dot icon right. Lives inside the
// pinned hero so it stays put while the hero is on screen, exactly as in Figma.
export const NAV_LINKS: { label: string; href: string }[] = [
  ...CHANNELS.map(channel => ({ label: channel.title, href: channel.slug })),
  { label: "Subscribe", href: MONDAY_FORM },
  { label: "Get in touch", href: "/get-in-touch" },
];

export function Nav({darkMode, minimal = false} : {darkMode: boolean; minimal?: boolean}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  const menuButton = (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: r(11.8),
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-haspopup="true"
      aria-expanded={isMenuOpen}
    >
      {!isMobile && (
        <span
          className="font-inter"
          style={{
            color: (darkMode) ? "#fff" : 'black',
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: r(20),
            letterSpacing: r(2.5601),
            lineHeight: 1.7,
          }}
        >
          MENU
        </span>
      )}
      <img
        src={(darkMode) ? asset("/assets/icon-menu.svg") : asset("/assets/icon-menu-dark.svg")}
        alt="Open menu"
        style={{ width: isMobile ? r(70) : r(18.38), 
          height: isMobile ? r(70) : r(18.38), 
          marginRight: isMobile ? r(30) : 0 }}
      />
    </button>
  );

  const dropdown = isMenuOpen && (
    <div
      style={{
        position: "absolute",
        top: isMobile ? r(120) : "100%",
        right: 0,
        marginTop: r(16),
        background: "rgba(11, 11, 43, 0.9)", // COLORS.navy with transparency
        backdropFilter: "blur(8px)",
        borderRadius: r(8),
        padding: `${r(16)} ${r(24)}`,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? r(50) : r(12),
        minWidth: isMobile ? '100%' : r(280),
        zIndex: 20,
      }}
    >
      {NAV_LINKS.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="font-inter nav-menu-link"
          style={{
            color: "#fff",
            fontWeight: 400, 
            fontSize: isMobile ? r(50) : r(17.6),
            textDecoration: "none",
            whiteSpace: "nowrap",
            padding: `${r(4)} 0`,
          }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  if (minimal) {
    return (
      <div ref={menuRef} style={{ position: "absolute", top: isMobile ? r(50) : r(40), right: isMobile ? r(40) : r(80), zIndex: 100 }}>
        {menuButton}
        {dropdown}
      </div>
    );
  }

  return (
    <FadeIn
      delay={0.15}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        ...fullBleed,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.navy,
        padding: isMobile ? `${r(50)} ${r(40)}` : `${r(5)} ${r(100)}`,
      }}
    >
      {/* the nora.edit wordmark: script "the … edit" (vector) + rounded "nora"
          outline (raster) layered at their exact Figma insets, both white. */}
      <Link href="/" style={{ position: "relative", width: isMobile ? r(500) : r(200), textDecoration: "none"}}>
        <img
          src={(darkMode) ? asset("/assets/NOR0001 theNORAedit_LOGO_WHITE_RGB.png") : asset("/assets/NOR0001 theNORAedit_LOGO_BLACK_RGB.png")}
          alt="The Nora Edit"
          style={{ position: "relative", inset: 0, width: '100%'}}
        /> 
        {/* <h3 className="font-ivy" style={{color: (darkMode) ? "white" : "black", width: r(400), fontSize: r(10), marginLeft: r(5), position: "relative"}}>Industry intelligence from the NORA Ecosystem</h3> */}
      </Link>

      <div ref={menuRef} style={{ position: "relative" }}>
        {menuButton}
        {dropdown}
      </div>
    </FadeIn>
  );
}
