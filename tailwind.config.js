/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'float': 'floatBackground linear infinite'
      },
      keyframes: {
        floatBackground: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}

