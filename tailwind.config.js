/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // ✅ Scan all .ts and .js files for class usage (e.g., styles.container)
    // ✅ Scan all .module.css files for @apply directives
    "./src/**/*.{js,ts,css,module.css}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
