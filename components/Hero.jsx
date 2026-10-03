"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
// To use your own car image: put the PNG in /public and change this path.
const CAR_SRC = `${BASE_PATH}/car.png`;

const HEADLINE = ["WELCOME", "ITZFIZZ"];

const STATS = [
  { value: 58, label: "Increase in pick up point use", tone: "bg-lime text-ink" },
  { value: 23, label: "Decreased in customer phone calls", tone: "bg-sky text-ink" },
  { value: 27, label: "Increase in pick up point use", tone: "bg-slate text-white" },
  { value: 40, label: "Decreased in customer phone calls", tone: "bg-flame text-ink" },
];

function Headline({ ghost = false }) {
  return (
    <div
      aria-hidden={ghost}
      className={`absolute inset-0 flex items-center whitespace-nowrap pl-[5vw] font-black leading-none tracking-[0.28em] text-[5.4vw] ${
        ghost ? "text-white/35" : "text-ink"
      }`}
    >
      {HEADLINE.map((word, w) => (
        <span key={word} className={`flex ${w === 0 ? "mr-[0.9em]" : ""}`}>
          {word.split("").map((ch, i) => (
            <span key={i} className={`${ghost ? "ghost-letter" : "hl-letter"} inline-block opacity-0 will-change-transform`}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

function StatCard({ stat, index }) {
  return (
    <div
      className={`stat-card h-full rounded-2xl p-[clamp(1rem,2vw,2.5rem)] opacity-0 ${stat.tone}`}
      data-step={index}
      data-value={stat.value}
    >
      <div className="stat-num text-[clamp(2.2rem,4vw,5rem)] font-bold leading-none tracking-tight">
        0%
      </div>
      <p className="mt-[1.2vw] text-[clamp(0.75rem,1.3vw,1.4rem)] leading-tight">{stat.label}</p>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const q = gsap.utils.selector(section);

    const ctx = gsap.context(() => {
      const stage = q(".stage")[0];
      const car = q(".car")[0];
      const trail = q(".trail")[0];
      const trailText = q(".trail-text")[0];

      // quickSetter is the cheapest way to write a transform every frame
      const setCar = gsap.quickSetter(car, "x", "px");
      const setTrail = gsap.quickSetter(trail, "x", "px");
      const setTrailText = gsap.quickSetter(trailText, "x", "px");

      // measured once per refresh, never inside the scroll loop
      const letters = q(".hl-letter");
      const lastT = letters.map(() => -1);
      let letterX = [];
      let W = stage.offsetWidth;
      let carW = car.offsetWidth;
      const measure = () => {
        W = stage.offsetWidth;
        carW = car.offsetWidth;
        letterX = letters.map((el) => el.offsetLeft);
        lastT.fill(-1);
      };
      measure();

      const state = { p: 0 };
      const render = () => {
        const carX = state.p * W; // car's rear edge
        const edge = Math.min(W, carX + carW * 0.18); // where green meets the car
        setCar(carX);
        setTrail(edge - W);
        setTrailText(W - edge); // counter-move so the text stays still

        // each letter fades up the moment the green trail reaches it
        const reveal = W * 0.07;
        for (let i = 0; i < letters.length; i++) {
          const t = Math.min(1, Math.max(0, (edge - letterX[i]) / reveal));
          if (t === lastT[i]) continue;
          lastT[i] = t;
          const e = 1 - Math.pow(1 - t, 3); // ease out
          letters[i].style.opacity = e;
          letters[i].style.transform = `translate3d(0, ${(1 - e) * 45}%, 0)`;
        }
      };
      render();
      trail.style.visibility = "visible"; // safe to show now that it is positioned

      /* ---------- 1. intro on load (car, headline, stats) ---------- */
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .fromTo(car, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2 })
        .fromTo(
          q(".ghost-letter"),
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.06 },
          0.3
        );

      // stats: one by one, 0.45s apart, each counting up as it lands
      q(".stat-card").forEach((card, i) => {
        const target = Number(card.dataset.value);
        const num = card.querySelector(".stat-num");
        const counter = { v: 0 };
        const at = 1.4 + i * 0.45;

        intro.fromTo(
          card,
          { y: 40, scale: 0.94, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.9 },
          at
        );
        intro.to(
          counter,
          {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => (num.textContent = `${Math.round(counter.v)}%`),
          },
          at
        );
      });

      /* ---------- 2. scroll-scrubbed animation ---------- */
      gsap
        .timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6, // eases toward the scroll position instead of snapping
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              render();
            },
          },
        })
        .to(state, { p: 1, onUpdate: render }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    // tall section = scroll distance; the stage inside stays pinned
    <section ref={sectionRef} className="relative h-[400vh] bg-page">
      <div className="stage sticky top-0 flex h-screen w-full flex-col justify-center gap-[6vh] overflow-hidden">
        {/* headline on the road; the car drives over it leaving a green trail */}
        <div className="relative h-[24vh] min-h-[130px] w-full shrink-0 overflow-hidden bg-road">
          <Headline ghost />

          <div className="trail invisible absolute inset-0 overflow-hidden bg-trail will-change-transform">
            <div className="trail-text absolute inset-0 will-change-transform">
              <Headline />
            </div>
          </div>

          <img
            src={CAR_SRC}
            alt="Top view of a sports car"
            className="car absolute left-0 top-0 h-full w-auto max-w-none opacity-0 will-change-transform"
            draggable={false}
          />
        </div>

        {/* stats below the headline */}
        <div className="grid grid-cols-2 gap-3 px-[5vw] md:grid-cols-4 md:gap-5">
          {STATS.map((s, i) => (
            <StatCard key={s.value} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
