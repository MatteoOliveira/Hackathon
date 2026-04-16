import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Charte graphique Solimouv'
        brand: {
          DEFAULT: '#4F46E5', // indigo-600
          light: '#818CF8',   // indigo-400
          dark: '#3730A3',    // indigo-800
        },
        accent: {
          DEFAULT: '#F59E0B', // amber-500 — chaleur, sport
          light: '#FCD34D',
          dark: '#B45309',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'countdown-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'countdown-pulse': 'countdown-pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
