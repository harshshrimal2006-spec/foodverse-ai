/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#06090F',
          900: '#090D16',
          850: '#0D1322',
          800: '#111827',
          700: '#1F2937',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
        rose: {
          500: '#F43F5E',
          600: '#E11D48',
        }
      },
      animation: {
        'laser-sweep': 'laserSweep 2.2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      },
      keyframes: {
        laserSweep: {
          '0%': { top: '0%' },
          '100%': { top: '96%' },
        }
      }
    },
  },
  plugins: [],
}
