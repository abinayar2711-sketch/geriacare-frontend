"use client";
import React, { useMemo } from "react";

export default function PortraitAnimated({ variant = "illustration", className = "" }: { variant?: "illustration" | "blink" | "geometric"; className?: string }) {
  // randomize blink delay so multiple instances don't sync
  const blinkDelay = useMemo(() => `${Math.random() * 6}s`, []);
  const blinkDur = "6s";

  if (variant === "geometric") {
    return (
      <div className={`portrait-animated ${className}`} style={{ ['--blink-delay' as any]: blinkDelay, ['--blink-dur' as any]: blinkDur }}>
        <svg viewBox="0 0 320 320" role="img" aria-label="Modern geometric portrait">
          <rect x="20" y="20" width="280" height="280" rx="40" fill="#2a1520" />
          <circle cx="160" cy="120" r="60" fill="#e5c4a0" />
          <rect x="110" y="190" width="100" height="70" rx="20" fill="#3d2430" />
          <circle cx="130" cy="120" r="8" fill="#5b4a38" className="eye" />
          <circle cx="190" cy="120" r="8" fill="#5b4a38" className="eye" />
        </svg>
      </div>
    );
  }

  // base illustration (kept similar to original) with optional blink animation
  return (
    <div className={`portrait-animated ${className} ${variant === "blink" ? "portrait-float" : "portrait-float"}`} style={{ ['--blink-delay' as any]: blinkDelay, ['--blink-dur' as any]: blinkDur }}>
      <svg viewBox="0 0 320 320" role="img" aria-label="Animated illustrated portrait">
        <defs>
          <clipPath id="pClip2">
            <circle cx="160" cy="160" r="146" />
          </clipPath>
        </defs>
        <circle cx="160" cy="160" r="146" fill="#2a1520" stroke="#d4a853" strokeWidth="2.5" />
        <g clipPath="url(#pClip2)">
          <circle cx="160" cy="120" r="150" fill="#351e28" />
          <path d="M58 320 C58 256 112 230 160 230 C208 230 262 256 262 320 Z" fill="#3d2430" />
          <path d="M160 234 L132 302 M160 234 L188 302" fill="none" stroke="#2a1520" strokeWidth="2.5" />
          <path d="M146 234 L160 264 L174 234 Z" fill="#c9a87a" />
          <path d="M143 194 h34 v24 q-17 12 -34 0 Z" fill="#deb89a" />
          <path d="M98 158 C98 100 130 70 160 70 C190 70 222 100 222 158 C222 132 206 118 186 114 C170 111 150 111 134 114 C114 118 98 132 98 158 Z" fill="#e0dcd0" />
          <ellipse cx="160" cy="150" rx="54" ry="62" fill="#e5c4a0" />
          <ellipse cx="107" cy="152" rx="10" ry="14" fill="#e5c4a0" />
          <ellipse cx="213" cy="152" rx="10" ry="14" fill="#e5c4a0" />
          <ellipse cx="128" cy="170" rx="12" ry="8" fill="#d4917a" opacity="0.3" />
          <ellipse cx="192" cy="170" rx="12" ry="8" fill="#d4917a" opacity="0.3" />
          <path d="M122 132 q14 -7 28 0 M170 132 q14 -7 28 0" fill="none" stroke="#b0a898" strokeWidth="2.5" strokeLinecap="round" />
          {/* eyes (animated when variant===blink) */}
          <g transform="translate(0,0)" fill="none" stroke="#5b4a38" strokeWidth="2.5" strokeLinecap="round">
            <path d="M127 151 q9 7 18 0" className="eye" style={{ transformOrigin: "center" }} />
            <path d="M175 151 q9 7 18 0" className="eye" style={{ transformOrigin: "center" }} />
          </g>
          <g fill="none" stroke="#d4a853" strokeWidth="2.5">
            <rect x="118" y="140" width="34" height="26" rx="10" />
            <rect x="168" y="140" width="34" height="26" rx="10" />
            <path d="M152 150 h16" />
          </g>
          <path d="M160 155 v14 q-6 4 -11 0" fill="none" stroke="#c99e75" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M138 187 q22 20 44 0" fill="none" stroke="#a05a3c" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>

      {/* small thumbnails of variant options for quick visual choices */}
      <div className="mt-3 flex gap-2 justify-center">
        <div className="rounded-md border border-[#4a2838] p-1 bg-[#2a1520]">
          <svg viewBox="0 0 64 64" width="56" height="56">
            <circle cx="32" cy="24" r="12" fill="#e5c4a0" />
            <rect x="18" y="34" width="28" height="16" rx="4" fill="#3d2430" />
          </svg>
        </div>
        <div className="rounded-md border border-[#4a2838] p-1 bg-[#2a1520]">
          <svg viewBox="0 0 64 64" width="56" height="56">
            <rect x="4" y="4" width="56" height="56" rx="8" fill="#2a1520" />
            <circle cx="32" cy="24" r="14" fill="#e5c4a0" />
            <circle cx="24" cy="24" r="3" fill="#5b4a38" />
            <circle cx="40" cy="24" r="3" fill="#5b4a38" />
          </svg>
        </div>
        <div className="rounded-md border border-[#4a2838] p-1 bg-[#2a1520]">
          <svg viewBox="0 0 64 64" width="56" height="56">
            <circle cx="32" cy="32" r="28" fill="#351e28" stroke="#d4a853" strokeWidth="2" />
            <path d="M22 36 q10 10 20 0" fill="none" stroke="#a05a3c" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
