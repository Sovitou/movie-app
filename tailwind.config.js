/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1C0333",
        "text-primary": "#FFFFFF",
        "card-background": "#2D1445",
        "primary-accent": "#7A3AFF",
        "secondary-text": "#D1C4E9",
        "border-color": "#3A2650",
      },
    },
  },
  plugins: [],
};
