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
      clipPath: {
      'polygon': 'polygon(0 30%, 100% 00%, 100% 100%, 0% 100%)',

      }
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('@tailwindcss/forms'),
    // Add a custom plugin for clip-path
    function({ addUtilities, theme }) {
      const newUtilities = {}
      Object.entries(theme('clipPath') || {}).forEach(([name, value]) => {
        newUtilities[`.clip-${name}`] = { clipPath: value }
      })
      addUtilities(newUtilities)
    }
  ],
}
