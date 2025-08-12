/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent-yellow': '#FFD700',
        'dark-bg': '#1a1a1a',
        'dark-card': '#2d2d2d',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#cccccc',
      },
    },
  },
  plugins: [],
} 