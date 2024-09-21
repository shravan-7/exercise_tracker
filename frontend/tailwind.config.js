module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
    },
  },
  plugins: [],
  important: true, // Add this line if you want to ensure Tailwind styles take precedence
};
