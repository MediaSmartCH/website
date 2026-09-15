module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-gray": "#EBEBEB",
      },
      fontFamily: {
        montserrat: "Montserrat",
        poppins: "Poppins",
        redDisplay: "Red Hat Display",
        helvetica: "helvetica",
        mulish: "Mulish",
        sans: ['Poppins', 'Red Hat Display', 'Mulish', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
