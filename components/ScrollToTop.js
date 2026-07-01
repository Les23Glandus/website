"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * T110 — remplace components/ScrollToTop.js (basé sur withRouter + window.scrollTo).
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
