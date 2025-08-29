// path: postcss.config.js
module.exports = {
  plugins: {
    // ⬇️ Tailwind v4 requires this package instead of "tailwindcss"
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
