import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./popup.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(36 35% 96%)",
        foreground: "hsl(14 14% 12%)",
        card: "hsl(36 40% 98%)",
        "card-foreground": "hsl(14 14% 12%)",
        primary: "hsl(19 65% 46%)",
        "primary-foreground": "hsl(36 50% 98%)",
        secondary: "hsl(39 32% 90%)",
        "secondary-foreground": "hsl(14 14% 12%)",
        muted: "hsl(38 28% 88%)",
        "muted-foreground": "hsl(18 10% 35%)",
        border: "hsl(29 22% 78%)",
        input: "hsl(33 24% 85%)",
        ring: "hsl(19 65% 46%)",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      fontFamily: {
        sans: ["'Avenir Next'", "'Trebuchet MS'", "'Segoe UI'", "sans-serif"],
      },
      boxShadow: {
        panel: "0 16px 40px rgba(72, 43, 23, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
