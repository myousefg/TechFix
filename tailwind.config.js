export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '390px',
    },
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#e8f4ff',
          100: '#c3e0ff',
          200: '#85c2ff',
          300: '#47a3ff',
          400: '#1a85ff',
          500: '#0066e6',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        accent: {
          400: '#00e5c4',
          500: '#00c9ab',
        }
      }
    }
  }
}
