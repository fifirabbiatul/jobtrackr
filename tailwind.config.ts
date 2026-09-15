import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1F44", 50: "#F1F5FA", 100: "#E3EAF4", 700: "#173769", 900: "#0A1F44" },
        teal: { DEFAULT: "#14B8A6", 50: "#F0FDFA", 100: "#CCFBF1", 600: "#0D9488" },
      },
      boxShadow: { card: "0 1px 2px rgba(10,31,68,.04), 0 8px 24px rgba(10,31,68,.06)" },
    },
  },
  plugins: [],
};

export default config;
