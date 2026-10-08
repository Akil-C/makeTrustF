/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plaster: '#F7F7F4',
        paper: '#F1F1ED',
        'paper-mid': '#E4E5E0',
        'paper-dark': '#E7E7E4',
        blush: '#F3D6DC',
        'blush-soft': '#F5D9DF',
        'near-black': '#070707',
        navy: '#071521',
        sage: '#B7BAA9',
        'sage-dark': '#AEB1A0',
        grey: '#999999',
        accent: '#EF6F79',
        primary: {
          50: '#fff5f6',
          100: '#fde8eb',
          500: '#ef6f79',
          600: '#e14e5a',
          700: '#c23843',
          900: '#070707',
        },
        trust: {
          green: '#16a34a',
          gold: '#d97706',
          platinum: '#6b7280',
        }
      },
      fontFamily: {
        bodoni: ['"Bodoni Moda"', 'serif'],
        caveat: ['"Caveat Brush"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
