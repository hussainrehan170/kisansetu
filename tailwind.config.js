/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E4620',
        accent: '#D97706',
        profit: '#16A34A',
        logistics: '#2563EB',
        surface: '#FFFFFF',
        muted: '#F6F8F5',
        'border-color': '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
