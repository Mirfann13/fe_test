/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        bgYellow: "#fff441",
        bgBlack: "#000000",
        bgWhite: "#ffffff",
        bgRed: "#fd2313",
        bgGreen: "#61ff0a",
      },
    },
  },
  plugins: [],
};
