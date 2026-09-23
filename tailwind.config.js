/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f0ff',
          100: '#e6e1ff',
          200: '#cec4ff',
          300: '#ac99ff',
          400: '#8b6bff',
          500: '#6f42f5',
          600: '#5b2fd6',
          700: '#4a24ad',
          800: '#3c1f89',
          900: '#331d6e',
        },
      },
      boxShadow: {
        soft: '0 2px 10px rgba(20, 15, 60, 0.06)',
        card: '0 4px 20px rgba(20, 15, 60, 0.08)',
      },
    },
  },
  plugins: [],
};
