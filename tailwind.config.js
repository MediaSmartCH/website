module.exports = {
  // src/_archive holds retired components that nothing imports; scanning them
  // only emits utility classes the site never renders.
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "!./src/_archive/**"],
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
