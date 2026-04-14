import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        arabic: ["var(--font-ibm-plex-arabic)", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.04)",
        glow: "0 0 20px rgba(37,99,235,0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "marquee": "marquee 30s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "ken-burns": "kenBurns 8s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "badge-pulse": "badgePulse 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "marquee-slow": "marquee 45s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        kenBurns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        badgePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(37,99,235,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(37,99,235,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
