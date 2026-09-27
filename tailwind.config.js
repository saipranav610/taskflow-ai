/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Glossy cyan/teal accent — the glowing-orb color from the reference UI.
        brand: {
          50: '#EBFEFF', 100: '#CEFBFF', 200: '#9FF3FC', 300: '#63E4F2',
          400: '#2FCFE3', 500: '#14B4CE', 600: '#0D93AE', 700: '#0E7488',
          800: '#125D6E', 900: '#134D5C',
        },
        // Deep teal-black surfaces — page bg through to elevated inputs.
        ink: { 900: '#050C10', 800: '#081418', 700: '#0C1A20', 600: '#122530', 500: '#1B333F' },
        paper: { DEFAULT: '#F3F4F1', card: '#FFFFFF' },
        ember: {
          50: '#FFF1EC', 100: '#FFE0D3', 200: '#FFC1A8', 300: '#FF9C77',
          400: '#FF7E52', 500: '#FF6B45', 600: '#F04E28', 700: '#C93D1D',
          800: '#9F311A', 900: '#7E2A19',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
        card: '0 4px 24px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.2)',
        nav: '0 -2px 20px rgba(0, 0, 0, 0.3)',
        fab: '0 0 0 1px rgba(47, 207, 227, 0.25), 0 8px 24px rgba(47, 207, 227, 0.4)',
        glow: '0 0 0 1px rgba(47, 207, 227, 0.2), 0 4px 20px rgba(47, 207, 227, 0.25)',
        'glow-lg': '0 0 60px rgba(47, 207, 227, 0.35), 0 0 120px rgba(47, 207, 227, 0.15)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(60% 50% at 50% 0%, rgba(47,207,227,0.16) 0%, rgba(47,207,227,0) 70%)',
        'orb-gradient': 'radial-gradient(circle at 35% 30%, #8FF2FF 0%, #2FCFE3 45%, #0D6C7E 100%)',
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
