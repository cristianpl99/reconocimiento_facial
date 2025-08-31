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
        },
        'pop-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '80%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'pulse-opacity': 'pulse-opacity 4s ease-in-out infinite',
        'pop-in': 'pop-in 0.3s ease-out',
      }
    },
  },
  plugins: [],
};
