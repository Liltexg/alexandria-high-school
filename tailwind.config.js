/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A01526",
        "primary-bright": "#C01B2E",
        accent: "#D4AF37",
        dark: "#020617",
        "dark-accent": "#0f172a",
        "vibrant-tint": "#F1F5F9",
        "warm-tint": "#FFFBF0",
        soft: "#F8FAFC",
        light: "#FFFFFF"
      },
      boxShadow: {
        'glow': '0 0 15px rgba(160, 21, 38, 0.3)',
        'glow-large': '0 0 30px rgba(160, 21, 38, 0.4)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/bg-pattern.png')", // Placeholder if needed
      }
    },
  },
  plugins: [],
}
