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
        success: { 50: '#ecfdf3', 100: '#d1fadf', 600: '#027a48', 700: '#05603a' },
        warning: { 50: '#fffaeb', 100: '#fef0c7', 600: '#b54708', 700: '#93370d' },
        danger: { 50: '#fff1f3', 100: '#ffe4e8', 600: '#e31b54', 700: '#c01048' },
        info: { 50: '#eff8ff', 100: '#d1e9ff', 600: '#1570ef', 700: '#175cd3' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.05)',
        elevated: '0 12px 36px rgba(16,24,40,.14)',
      },
    },
  },
  plugins: [],
}
