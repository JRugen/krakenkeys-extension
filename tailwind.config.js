export default {
  content: ['./entrypoints/**/*.{vue,ts,html}', './components/**/*.vue'],
  theme: {
    extend: {
      colors: {
        steam: {
          bg: '#1b2838',
          panel: '#16202d',
          raised: '#1f2d3d',
          line: '#2a3f5a',
          row: '#22334a',
          text: '#c6d4df',
          muted: '#8f98a0',
          blue: '#66c0f4',
          sale: '#beee11',
          'sale-bg': '#4c6b22',
        },
        kraken: {
          DEFAULT: '#7f2aff',
          hover: '#9150ff',
          soft: '#2a1f4d',
          text: '#c4a8ff',
        },
      },
      fontFamily: {
        steam: ['"Motiva Sans"', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
