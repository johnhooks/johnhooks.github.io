module.exports = {
  "**/*.(ts|svelte)": () => "yarn run check",
  "!(apps/)**/*.(js|cjs|mjs|ts|svelte)": (filenames) => [
    `eslint --ext .js,.cjs,.mjs,.ts,.svelte --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
  "apps/website/**/*.(js|cjs|mjs|ts|svelte)": (filenames) => [
    `yarn website:lint --fix ${filenames.join(" ")}`,
    `yarn website:format --write ${filenames.join(" ")}`,
  ],
};
