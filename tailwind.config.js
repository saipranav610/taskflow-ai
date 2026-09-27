/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EAFBF6', 100: '#CFF5E8', 200: '#9EE9D2', 300: '#66D6B6',
          400: '#35BE9B', 500: '#0E9B82', 600: '#0B7E6A', 700: '#0A6455',
          800: '#0A4F45', 900: '#0A413A',
        },
        ember: {
          50: '#FFF1EC', 100: '#FFE0D3', 200: '#FFC1A8', 300: '#FF9C77',
          400: '#FF7E52', 500: '#FF6B45', 600: '#F04E28', 700: '#C93D1D',
          800: '#9F311A', 900: '#7E2A19',
        },
        ink: { 900: '#0C0F13', 800: '#10151B', 700: '#161D25', 600: '#1D2630', 500: '#293341' },
        paper: { DEFAULT: '#F3F4F1', card: '#FFFFFF' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 21, 27, 0.04), 0 2px 8px rgba(16, 21, 27, 0.06)',
        card: '0 4px 16px rgba(16, 21, 27, 0.08), 0 1px 3px rgba(16, 21, 27, 0.05)',
        nav: '0 -2px 16px rgba(16, 21, 27, 0.08)',
        fab: '0 8px 20px rgba(14, 155, 130, 0.35)',
      },
      keyframes: {
        'check-pop': { '0%': { transform: 'scale(0.7)' }, '50%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'sheet-in': { '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
      animation: {
        'check-pop': 'check-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 0.35s ease-out',
        'sheet-in': 'sheet-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
