import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#16140F",
        ink: "#F3EFE6",
        moss: "#8FD9BE",
        rust: "#C97A2B",
        line: "#33302A",
        cardtext: "#221E17",
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
