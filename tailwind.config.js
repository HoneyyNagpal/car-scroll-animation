/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        page: "#d3d3d3",
        road: "#1c1c1c",
        trail: "#4ade80",
        lime: "#dff54f",
        ink: "#0d0d0d",
        slate: "#2f2f2f",
        sky: "#6cc8ff",
        flame: "#fb7226",
      },
    },
  },
  plugins: [],
};
