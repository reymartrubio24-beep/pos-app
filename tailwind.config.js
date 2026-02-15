import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          ...colors.zinc,
          900: '#1A1A1D',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
