/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-text)",
        secondary: "var(--color-heading)",
        "bg-primary": "var(--color-background)",
        "bg-soft": "var(--color-background-soft)",
        "bg-mute": "var(--color-background-mute)",
        "border-primary": "var(--color-border)",
        "border-secondary": "var(--color-border-hover)",
      },
      spacing: {
        "divider": "var(--section-gap)",
        "divider-2": "calc(var(--section-gap) / 2)",
        "shift-25": "calc(50% + 25px)",
        "unshift-25": "calc(50% - 25px)"
      }
    },
  },
  plugins: []
}
