/** @type {import("prettier").Config} */
export default {
  printWidth: 90,
  proseWrap: "always",
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
