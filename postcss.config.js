const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss,
    // https://www.npmjs.com/package/postcss-preset-env
    postcssPresetEnv(),
  ],
};
