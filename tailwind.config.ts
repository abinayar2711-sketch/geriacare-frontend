import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1b1a17",
        muted: "#6b6560",
        line: "#e5e0d8",
        paper: "#faf8f5",
        surface: "#fffefb",

        accent: "#7a3b5e",
        "accent-soft": "#f3e4ed",

        warm: "#8a5a2b",
        "warm-soft": "#f2e7db",

        crisis: "#b91c1c",
        "crisis-soft": "#fef2f2",

        sage: "#7a9e7e",
        "sage-soft": "#e8ece6",

        helix: "#a0615a",
        "helix-soft": "#d4917a",

        "oc-bg": "#0a0a0a",
        "oc-surface": "#141414",
        "oc-border": "#484848",
        "oc-primary": "#c77f58",
        "oc-accent": "#9d7cd8",
        "oc-text": "#eeeeee",
        "oc-muted": "#808080",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
