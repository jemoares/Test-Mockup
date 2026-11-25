"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  EDITORIAL_ARTICLES_FEATURED_POV,
  EDITORIAL_ARTICLES_1,
  EDITORIAL_ARTICLES_INTELLIGENCE,
} from "./constants";


const LAST_PATH_KEY = "nora_last_path";

const BACK_LABELS: Record<string, string> = {
  "/": "NORA Edit",
  "/channel/in-collaboration": "In collaboration",
  "/channel/the-intelligence-unit": "The intelligence unit",
  "/channel/featured-pov": "Featured POV",
};

// Articles that live inside a channel resolve back to that channel's label.
const OWNING_CHANNEL: Record<string, string> = {};
for (const a of EDITORIAL_ARTICLES_1) {
  if (a.href) OWNING_CHANNEL[a.href.replace(/\/+$/, "")] = "In collaboration";
}
for (const a of EDITORIAL_ARTICLES_INTELLIGENCE) {
  if (a.href) OWNING_CHANNEL[a.href.replace(/\/+$/, "")] = "The intelligence unit";
}

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

// Pass `record=true` on pages that should become the "previous page" for the next
// navigation (channel/home pages). Article pages pass `record=false`: their label
// is resolved deterministically from the channel they belong to, so it works even
// on direct loads where there is no tracked previous page.
export function useBackLabel(record = true): string {
  const pathname = usePathname();
  const path = pathname ? norm(pathname) : "";

  const resolve = (): string => {
  if (typeof window === "undefined") return "NORA Edit";

  // Check if the article was opened from the homepage
  const params = new URLSearchParams(window.location.search);

  if (params.get("from") === "home") {
    return "NORA Edit";
  }

  if (OWNING_CHANNEL[path]) return OWNING_CHANNEL[path];

  const prev = sessionStorage.getItem(LAST_PATH_KEY);
  return (prev && prev !== path && BACK_LABELS[prev]) || "NORA Edit";
};

  const [label, setLabel] = useState<string>("NORA Edit");

  useEffect(() => {
  if (typeof window === "undefined") return;
  setLabel(resolve());
  }, [path]);

  useEffect(() => {
    if (!record || typeof window === "undefined") return;
    if (path && BACK_LABELS[path]) {
      sessionStorage.setItem(LAST_PATH_KEY, path);
    }
  }, [record, path]);

  return label;
}