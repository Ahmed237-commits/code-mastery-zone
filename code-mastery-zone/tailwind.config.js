/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'float-card-1': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)'
          },
          '25%': {
            transform: 'translateY(-8px) translateX(4px)'
          },
          '75%': {
            transform: 'translateY(5px) translateX(-3px)'
          }
        },
        'float-card-2': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)'
          },
          '33%': {
            transform: 'translateY(-6px) translateX(-4px)'
          },
          '66%': {
            transform: 'translateY(7px) translateX(3px)'
          }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'float-card-1': 'float-card-1 6s ease-in-out infinite',
        'float-card-2': 'float-card-2 7s ease-in-out infinite',
      }
    },
  },
  plugins: [],
  darkMode: 'class', // لو بتستخدم dark mode
}