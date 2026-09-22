import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F0EBE0",
        ink: "#1F2420",
        moss: "#3F5D4A",
        rust: "#B5502E",
        line: "#D9D2C2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-plex)"],
      },
    },
  },
  plugins: [],
};

export default config;
