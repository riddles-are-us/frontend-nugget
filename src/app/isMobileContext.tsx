// IsMobileContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  isMobile: boolean;
  width: number;
  height: number;
};

const IsMobileContext = createContext<Ctx | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
  /** Tailwind-style default breakpoint */
  breakpointPx?: number; // e.g. 768
  /** For SSR (e.g., Next.js) you can pass a default value to avoid hydration mismatch */
  defaultIsMobile?: boolean;
};

export function IsMobileProvider({
  children,
  breakpointPx = 768,
  defaultIsMobile = false,
}: ProviderProps) {
  const [isMobile, setIsMobile] = useState(defaultIsMobile);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);

    // Initialize
    setIsMobile(mql.matches);
    setSize({ width: window.innerWidth, height: window.innerHeight });

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    // Modern addEventListener fallback for Safari
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange);
    } else {
      mql.addListener(onChange);
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange);
      } else {
        mql.removeListener(onChange);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [breakpointPx]);

  const value = useMemo<Ctx>(
    () => ({ isMobile, width: size.width, height: size.height }),
    [isMobile, size.width, size.height]
  );

  return (
    <IsMobileContext.Provider value={value}>{children}</IsMobileContext.Provider>
  );
}

export function useIsMobile() {
  const ctx = useContext(IsMobileContext);
  if (!ctx) {
    throw new Error("useIsMobile must be used within <IsMobileProvider>");
  }
  return ctx; // { isMobile, width, height }
}
