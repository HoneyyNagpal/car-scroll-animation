"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis gives inertial smooth scrolling. It is driven by GSAP's ticker so
 * ScrollTrigger always reads the smoothed scroll position.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return children;
}
