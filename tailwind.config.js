/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#ED1836",
        secondary: "#FAF755",
        background: "#0F1923",
        "true-black": "#090f15",
        "true-gray": "#d4d4d4",
      },
    },
  },
  plugins: [],
};
