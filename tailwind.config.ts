import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CMA CGM palette
        navy: {
          DEFAULT: '#003B6F',
          light: '#004d92',
          dark: '#002952',
          900: '#001a38',
          800: '#002952',
          700: '#003B6F',
          600: '#004d92',
        },
        // Shared accent red
        brand: {
          red: '#E30613',
          'red-dark': '#b8050f',
        },
        // Devoteam palette
        devo: {
          red: '#E3000F',
          grey: '#2D2D2D',
        },
        // UI surfaces
        surface: {
          DEFAULT: '#0a1628',
          elevated: '#0f2040',
          card: '#132a52',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'counter': 'counter 2s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
