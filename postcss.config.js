/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require("postcss-nested"),
    require("tailwindcss"),
    require("autoprefixer"),
  ],
};

module.exports = config;
