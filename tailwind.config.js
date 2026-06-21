import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f9f8f5',
        'cream-dark': '#f3f0ea',
        gold: '#c4a265',
        'gold-hover': '#b3924f',
        'dark': '#1a1a1a',
        'dark-footer': '#111111',
        'muted': '#888888',
        'muted-light': '#aaaaaa',
        'border-light': '#e5e0d8',
        'green-stock': '#2d8a4e',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-xl': '0.2em',
        'widest-2xl': '0.25em',
      },
      maxWidth: {
        '8xl': '1440px',
      },
    },
  },
  plugins: [
    typography,
  ],
}
