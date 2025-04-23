/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './static/index.html', // or wherever your HTML files are located
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  safelist: [
    'bg-red-500',
    'border-red-500',
    'bg-green-500',
    'border-green-500',
    'bg-blue-500',
    'border-blue-500',
    'bg-yellow-500',
    'border-yellow-500',
    'bg-purple-500',
    'border-purple-500',
    'bg-cyan-500',
    'border-cyan-500',
    'bg-pink-500',
    'border-pink-500',
    'bg-orange-500',
    'border-orange-500',
  ],

  plugins: [require('tailwindcss-textshadow')],
};
