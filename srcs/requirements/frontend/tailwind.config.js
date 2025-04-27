/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './static/index.html', // or wherever your HTML files are located
  ],
  theme: {
    extend: {
      transitionProperty: {
        'opacity-and-transform': 'opacity, transform',
      },
      colors: {
        customBlue: '#1e40af',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.75s ease-out forwards',
        'fade-out': 'fadeOut 0.75s ease-out forwards',
      },
    },
  },
  safelist: [
    'bg-red-500',
    'border-red-500',
    'text-red-400',
    'bg-green-500',
    'border-green-500',
    'text-green-400',
    'bg-blue-500',
    'border-blue-500',
    'text-blue-400',
    'bg-yellow-500',
    'border-yellow-500',
    'text-yellow-400',
    'bg-purple-500',
    'border-purple-500',
    'text-purple-400',
    'bg-cyan-500',
    'border-cyan-500',
    'text-cyan-400',
    'bg-pink-500',
    'border-pink-500',
    'text-pink-400',
    'bg-orange-500',
    'border-orange-500',
    'text-orange-400',
  ],

  plugins: [require('tailwindcss-textshadow')],
};
