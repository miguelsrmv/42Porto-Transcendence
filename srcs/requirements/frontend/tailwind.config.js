/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/index.html", // or wherever your HTML files are located
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-textshadow')],
};
