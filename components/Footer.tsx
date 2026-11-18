"use client";

import { asset } from "@/lib/asset";
import { r, FOOTER_H, COLORS, fullBleed } from "@/lib/px";
import { CSSProperties, useState } from "react";
import { FadeUp } from "./anim";
import { NAV_LINKS } from "./Nav"; // Import NAV_LINKS from Nav component
import { useIsMobile } from "./useIsMobile";
import { MONDAY_FORM } from "@/lib/constants"; // Import MONDAY_FORM constant

// Footer — navy band. Coordinates are Figma-y minus the footer origin (6369).
export function Footer() {
  const isMobile = useIsMobile();
  const [showPopup, setShowPopup] = useState(false);

  const popupStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  };

  const popupContentStyles: CSSProperties = {
    position: 'relative',
    width: '80%',
    maxWidth: '800px',
    height: '80%',
    background: 'white',
    padding: isMobile ? r(20) : '20px',
    borderRadius: '8px',
    boxSizing: 'border-box',
  };

  const closeButtonStyles: CSSProperties = {
    position: 'absolute',
    top: isMobile ? r(20) : '10px',
    right: isMobile ? r(20) : '10px',
    background: 'transparent',
    border: 'none',
    fontSize: isMobile ? r(60) : '24px',
    cursor: 'pointer',
    color: '#333',
    lineHeight: 1,
    padding: 0,
  };

  const iframeStyles: CSSProperties = {
    width: '100%',
    height: '100%',
  };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 4, // Reduced height to minimize whitespace
        width: "100%",
        height: isMobile ? r(500) : r(300), // New reduced height
        color: "#fff",
      }}  
    >
      {/* Navy band, bled edge-to-edge (full-bleed) behind the on-grid content. */}
      <div
        aria-hidden
        style={{
          ...fullBleed,
          position: "absolute",
          top: 0,
          height: "100%",
          background: COLORS.navy,
          pointerEvents: "none",
        }}
      />

      {/* Asterisk mark */}
      <img
        src={asset("/assets/icon-asterisk.svg")}
        alt=""
        aria-hidden
        style={{ 
          position: "absolute", 
          left: r(61), 
          top: r(30), 
          width: isMobile ? r(80) : r(25), 
          height: isMobile ? r(80) : r(27) 
        }}
      />

      {/* Newsletter heading */}

      <FadeUp y={18} style={{ 
        position: "absolute", 
        left: isMobile ? r(50) : r(50), 
        top: isMobile ? r(120) : r(61) 
        }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <a href={asset("/")} style={{ position: "relative", width: r(224), textDecoration: "none"}}>
          <img
            src={asset("/assets/NOR0001 theNORAedit_LOGO_WHITE_RGB.png")}
            alt="The Nora Edit"
            style={{ 
              position: "relative", 
              inset: 0, 
              width: isMobile ? r(500) : r(300)
            }}
          /> 
          </a>
          <a
            href="https://nora.org.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter"
            style={{
              fontSize: isMobile ? r(28) : r(14),
              lineHeight: "100%",
              letterSpacing: r(0.28),
              color: "#fff",
              textDecoration: "underline",
              marginTop: r(5),
              marginLeft: r(15)
            }}
          >
            Powered by NORA
          </a>
        </div>
      </FadeUp>

      {/* Email capture */}
      <p
        className="font-inter"
        style={{
          position: "absolute",
          left: isMobile ? r(600) : r(394),
          top: r(55),
          width: isMobile ? r(400) : r(324), 
          fontSize: isMobile ? r(30) :r(15.4),
          lineHeight: isMobile ? "100%" : r(20),
          letterSpacing: r(0.28),
          color: "#fff",
        }}
      >
        Industry-level consequential insights delivered to you. Subscribe.
      </p>
      <button
        onClick={() => setShowPopup(true)}
        className="label"
        style={{
          position: "absolute",
          left: isMobile ? r(570) : r(397),
          top: isMobile ? r(200) : r(120),
          background: "transparent",
          border: "1px solid white",
          color: "white",
          padding: isMobile ? `${r(20)} ${r(40)}` : "0.75rem 1.5rem",
          fontSize: isMobile ? r(25) : "0.8rem",
          cursor: "pointer",
          borderRadius: "50px",
          transition: "background-color 0.3s, color 0.3s",
        }}
        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "white"; e.currentTarget.style.color = COLORS.navy; }}
        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "white"; }}
      >
        Subscribe now
      </button>

      {showPopup && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
            <button onClick={() => setShowPopup(false)} style={closeButtonStyles}>
              &times;
            </button>
            <iframe
              // To pass the email to the form, you need to find the correct URL parameter for the email field in your monday.com form settings.
              // It will likely be in the format of `?column_id=value`.
              // I've used a placeholder `your_email_column_id` which you should replace with the actual ID from your form.
              src={MONDAY_FORM}
              style={iframeStyles}
              frameBorder="0"
              title="Subscription Form"
            ></iframe>
          </div>
        </div>
      )}

      {/* NAV_LINKS from Nav component, listed vertically */}
      {/* <div
        style={{
          position: "absolute",
          left: r(800), // Position to the right of the email form
          top: r(50), // Align with other top elements
          display: "flex",
          flexDirection: "column",
          gap: r(10), // Spacing between links
          color: "#fff",
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-inter"
            style={{ color: "#fff", fontWeight: 400, fontSize: r(15.4), whiteSpace: "nowrap" }}
          >
            {link.label}
          </a>
        ))}
      </div> */}

      {/* Quote */}
      <FadeUp y={18} style={{ 
        position: "absolute", 
        right: isMobile ? r(0) : r(20), 
        width: isMobile ? r(400) : r(300),
        top: r(50) }}>
        <p
          className="font-arapey"
          style={{
            fontStyle: "italic",
            fontSize: isMobile ? r(50) : r(31.9),
            lineHeight: isMobile ? "100%" : r(35),
            letterSpacing: r(-0.87),
            color: "#fff",
          }}
        >
        "The best way to predict the future is to invent it"
        </p>
        <p
          className="font-inter"
          style={{
            fontSize: isMobile ? r(30) : r(15.4),
            letterSpacing: r(0.28),
            color: "#fff",
          }}
        >
          — Allan Kay
        </p>
      </FadeUp>

      {/* Bottom bar */}
      <div
        className="font-inter"
        style={{
          position: "absolute",
          left: r(61),
          right: r(61),
          bottom: r(20),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: isMobile ? r(25) : r(15.4),
          fontWeight: 300,
          lineHeight: r(30),
          letterSpacing: r(0.28),
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: r(20) }}>
          <p>
          © {new Date().getFullYear()} TheNoraEdit&nbsp;&nbsp;All rights reserved
          </p>
          <a style={{textDecoration: "none", color: "white"}} href="https://www.linkedin.com/company/national-online-retailers-association/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a style={{textDecoration: "none", color: "white"}} href="https://www.instagram.com/nora_network/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div style={{ display: "flex", gap: r(20) }}>
          <a style={{textDecoration: "none", color: "white"}} href="https://nora.org.au/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy policy</a>
          <a style={{textDecoration: "none", color: "white"}} href={asset("/get-in-touch")} rel="noopener noreferrer">Get in Touch</a>
        </div>
      </div>
    </footer>
  );
}
