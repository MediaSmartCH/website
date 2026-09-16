module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-gray": "#EBEBEB",
        // Semantic roles backed by the CSS variables in src/styles/tokens.css.
        // They resolve per theme through .App / .AppDark, which removes the
        // `isLight ? "text-[#14172D]" : "text-[#F6F6F6]"` ternaries from the JSX.
        heading: "var(--color-heading)",
        "heading-strong": "var(--color-heading-strong)",
        "heading-invert": "var(--color-heading-invert)",
        ink: "var(--color-ink)",
        body: "var(--color-body)",
        "body-soft": "var(--color-body-soft)",
        "body-alt": "var(--color-body-alt)",
        "body-on-surface": "var(--color-body-on-surface)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        accent: "var(--color-accent)",
        "toggle-track": "var(--color-toggle-track)",
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
