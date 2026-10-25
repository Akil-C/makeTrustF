/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plaster: '#FFFFFF',
        paper: '#F8FAFC',
        'paper-mid': '#F1F5F9',
        'paper-dark': '#E2E8F0',
        blush: '#FFE4E6',
        'blush-soft': '#FFF1F2',
        'near-black': '#0F172A',
        navy: '#0F172A',
        sage: '#94A3B8',
        'sage-dark': '#64748B',
        grey: '#64748B',
        accent: '#E11D48',
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          900: '#0f172a',
        },
        trust: {
          green: '#059669',
          gold: '#d97706',
          platinum: '#64748b',
        },
        ink: {
          DEFAULT: '#0D0D0F',
          secondary: '#43444A',
          muted: '#6E6F76',
        },
        ground: {
          light: '#EFEFEE',
          stage: '#E4E4E2',
          dark: '#0D0D0F',
        },
        signal: {
          DEFAULT: '#2F5BFF',
          dark: '#7C97FF',
        },
        editorial: {
          ground: '#E7E3DA',
          'ground-sec': '#DCD7CB',
          ink: '#1A1917',
          'ink-sec': '#4A4741',
          muted: '#6E6A61',
          signal: '#9B3418',
        },
      },
      transitionTimingFunction: {
        tech: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontFamily: {
        bodoni: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        caveat: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        none: '0px',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
