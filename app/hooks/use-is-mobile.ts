// hooks/useIsMobile.js
"use client";

import { useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  if (typeof window === "undefined") return;

  const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

  const handleResize = () => {
    setIsMobile(mediaQuery.matches);
  };

  // Set initial value
  setIsMobile(mediaQuery.matches);

  // Listen for changes
  mediaQuery.addEventListener("change", handleResize);

  return isMobile;
}
