/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'pulse-opacity': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.2 },
        }
      },
      animation: {
        'pulse-opacity': 'pulse-opacity 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
