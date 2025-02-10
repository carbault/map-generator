/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      boxShadow: {
        hover: "0px 0px 4px 1px rgba(120, 120, 133, 0.2)",
      },
      colors: {},
    },
  },
  plugins: [],
};
