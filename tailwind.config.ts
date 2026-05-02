import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "-apple-system", "sans-serif"],
      },
      colors: {
        "primary-navy": "#1A1A6B",
        "accent-red": "#E4002B",
        "cta-blue": "#0071C2",
        surface: "#F5F5F5",
        card: "#FFFFFF",
        "primary-text": "#212121",
        "muted": "#757575",
        "border-default": "#E0E0E0",
        "cliq-cash": "#F9A825",
        "cliq-gold": "#C9A84C",
        success: "#2E7D32",
      },
      fontSize: {
        display: ["36px", { fontWeight: "700", lineHeight: "1.2" }],
        h1: ["28px", { fontWeight: "600", lineHeight: "1.3" }],
        h2: ["22px", { fontWeight: "600", lineHeight: "1.4" }],
        h3: ["18px", { fontWeight: "500", lineHeight: "1.4" }],
        body: ["14px", { fontWeight: "400", lineHeight: "1.5" }],
        caption: ["12px", { fontWeight: "400", lineHeight: "1.4" }],
        micro: ["10px", { fontWeight: "500", lineHeight: "1.2" }],
      },
      maxWidth: {
        site: "1440px",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
