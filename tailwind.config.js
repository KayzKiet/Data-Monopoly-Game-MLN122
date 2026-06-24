/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        oil: '#07090d',
        midnight: '#0b1733',
        deepblue: '#10234f',
        cyan: '#22d3ee',
        gold: '#f4c430',
      },
      boxShadow: {
        glow: '0 0 28px rgba(34, 211, 238, 0.22)',
        gold: '0 0 24px rgba(244, 196, 48, 0.18)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        board: '100fr repeat(9, 60fr) 100fr',
      },
      gridTemplateRows: {
        board: '100fr repeat(9, 60fr) 100fr',
      },
    },
  },
  plugins: [],
};
