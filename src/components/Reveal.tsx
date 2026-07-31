"use client";
import React, { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", threshold = 0.12 }: { children: React.ReactNode; className?: string; threshold?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("active");
            // once revealed, stop observing to avoid reflows
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    el.classList.add("reveal");
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
