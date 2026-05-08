/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060c1a',
          900: '#0a0f1e',
          800: '#0f1729',
          700: '#1a2340',
          600: '#243059',
          500: '#2e3d72',
        },
        gold: {
          200: '#f0dfa0',
          300: '#e8c97a',
          400: '#d4a843',
          500: '#c9a84c',
          600: '#a8893c',
        },
        cream: '#f5f0e8',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
