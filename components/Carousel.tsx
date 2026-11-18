"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

// Horizontal drag-to-scroll carousel. Also scrolls via trackpad/touch natively.
// Suppresses the click that follows a drag so card links don't fire mid-swipe.
export function Carousel({
  children,
  style,
  onProgress,
  scrollProgress,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onProgress?: (p: number) => void;
  // When supplied, the track is scrubbed horizontally by this 0→1 value (driven by the
  // page's vertical scroll) instead of relying on a horizontal drag/wheel.
  scrollProgress?: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    };
    el.classList.add("dragging");
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => {
    const el = ref.current;
    if (!el) return;
    drag.current.down = false;
    el.classList.remove("dragging");
  };

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Report horizontal scroll progress (0→1) so callers can react to the slide
  // (e.g. fade out copy the cards travel over). Fires on drag, wheel and trackpad.
  const onScroll = () => {
    const el = ref.current;
    if (!el || !onProgress) return;
    const max = el.scrollWidth - el.clientWidth;
    onProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0);
  };

  // Drive the horizontal position from an external vertical-scroll progress (0→1):
  // as the user scrolls the page down, the cards scrub sideways across the track.
  useEffect(() => {
    if (!scrollProgress) return;
    const apply = (p: number) => {
      const el = ref.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = Math.max(0, Math.min(1, p)) * max;
    };
    apply(scrollProgress.get());
    return scrollProgress.on("change", apply);
  }, [scrollProgress]);

  return (
    <div
      ref={ref}
      className="carousel-track"
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
}
