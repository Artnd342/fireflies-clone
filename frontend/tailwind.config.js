/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fireflies: {
          purple: '#6366F1',
          hover: '#4F46E5',
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
}