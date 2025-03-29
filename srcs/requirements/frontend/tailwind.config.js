/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./static/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        supersmash_title: ['supersmash_title', 'sans-serif'],
        serpentine: ['serpentine', 'sans-serif'],
      },
      textShadow: {
        'lg': '2px 2px 4px rgba(0, 0, 0, 0.7)',
        'xl': '4px 4px 8px rgba(0, 0, 0, 0.6)',
      },
      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
}
