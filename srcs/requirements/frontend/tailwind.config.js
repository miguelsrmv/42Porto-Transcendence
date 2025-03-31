/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/index.html", // or wherever your HTML files are located
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('@tailwindcss/forms'),
    function({ addUtilities, theme }) {
      const newUtilities = {}
      Object.entries(theme('clipPath') || {}).forEach(([name, value]) => {
        newUtilities
