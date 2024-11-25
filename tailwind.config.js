/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,css}",
    "./dist/**/*.{html,js,css}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#89B6A5',
          hover: '#7AA596'
        },
        secondary: {
          DEFAULT: '#F4D03F',
          hover: '#E5C130'
        },
        text: {
          DEFAULT: '#F2D4D7',
          dark: '#2C2C2C'
        },
        light: {
          DEFAULT: '#FFFFFF',
          dark: '#4F4F4F'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#2C2C2C'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Fira Sans Condensed', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        code: ['Fira Code', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 1s infinite',
        typing: 'typing 3s infinite'
      }
    },
  },
  plugins: [],
}