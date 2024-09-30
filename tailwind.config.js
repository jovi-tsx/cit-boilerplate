/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./web/src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        mono: [...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: "1.2rem",
        sm: "1.4rem",
        base: "1.6rem",
        lg: "2.4rem",
        xl: "3.2rem",
        "2xl": "4rem",
        "3xl": "4.8rem",
        "4xl": "5.6rem",
        "5xl": "6.4rem",
        "6xl": "7.2rem",
        "7xl": "8.0rem",
        "8xl": "8.8rem",
        "9xl": "9.6rem",
      },
    },
  },
  plugins: [],
};
