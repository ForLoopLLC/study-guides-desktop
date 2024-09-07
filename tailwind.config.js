import colors from 'tailwindcss/colors';

module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
    },
  },
  plugins: [],
};
