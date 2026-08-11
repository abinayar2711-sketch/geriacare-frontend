import { ImageResponse } from "next/og";

export const alt = "Geriacare — The Next Approach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "radial-gradient(900px 600px at 50% -10%, #3a2030 0%, transparent 62%), linear-gradient(168deg, #1e0e18 0%, #2a1520 46%, #1a1512 100%)",
          color: "#f4ecdb",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 440,
            height: 440,
            borderRadius: "50%",
            border: "2px solid #d4a853",
            opacity: 0.35,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -112,
            right: -112,
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "1.5px solid #d4a853",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -130,
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "2px solid #7a9e7e",
            opacity: 0.18,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden>
            <path
              d="M24 8 C18 12 18 16 24 20 C30 24 30 28 24 32 C18 36 18 40 24 44"
              fill="none"
              stroke="#d4a853"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M24 8 C30 12 30 16 24 20 C18 24 18 28 24 32 C30 36 30 40 24 44"
              fill="none"
              stroke="#7a9e7e"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <g stroke="#d4a853" strokeWidth="1.8" opacity="0.6">
              <line x1="19.8" y1="11" x2="28.2" y2="11" />
              <line x1="19.8" y1="17" x2="28.2" y2="17" />
              <line x1="28.2" y1="23" x2="19.8" y2="23" />
              <line x1="28.2" y1="29" x2="19.8" y2="29" />
              <line x1="19.8" y1="35" x2="28.2" y2="35" />
              <line x1="19.8" y1="41" x2="28.2" y2="41" />
            </g>
          </svg>
          <span
            style={{
              fontSize: 24,
              letterSpacing: "0.4em",
              color: "#d4a853",
              textTransform: "uppercase",
            }}
          >
            The Next Approach
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 112,
            fontWeight: 700,
            marginTop: 30,
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: "#d4a853" }}>GERIA</span>
          <span style={{ color: "#f4ecdb" }}>CARE</span>
        </div>

        <div
          style={{
            width: 120,
            height: 2,
            background: "#d4a853",
            opacity: 0.7,
            marginTop: 26,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 26,
            fontSize: 42,
            color: "#f4ecdb",
            fontWeight: 600,
          }}
        >
          Real Questions <span style={{ color: "#d4a853", opacity: 0.7 }}>·</span> Gentle Guidance
        </div>
        <div style={{ marginTop: 14, fontSize: 25, color: "#c8b89f" }}>
          A simple community. We're here, we care.
        </div>
      </div>
    ),
    { ...size },
  );
}
