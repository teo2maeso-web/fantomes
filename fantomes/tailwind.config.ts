import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E9F1F3",
        ink: "#16283D",
        moss: "#3D6B7A",
        rust: "#C9922E",
        line: "#C4D6DB",
        cardtext: "#16283D",
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
