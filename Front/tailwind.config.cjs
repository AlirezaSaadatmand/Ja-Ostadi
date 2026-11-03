/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Root HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All source files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#AB8A58",
          dark: "#7a5f33",
          light: "#faf6ef",
        },
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
