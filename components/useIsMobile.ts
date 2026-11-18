"use client";

import { useState, useEffect } from "react";

/**
 * A custom hook to detect if the screen is mobile-sized.
 * @param {number} breakpoint - The max-width in pixels to be considered mobile. Defaults to 768.
 * @returns {boolean} - True if the window width is less than the breakpoint.
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}