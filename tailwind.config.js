/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202f',
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          500: '#2f80ed',
          600: '#1768d1',
          700: '#1555aa',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.05)',
      },
    },
  },
  plugins: [],
}
