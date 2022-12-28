module.exports = {
  "**/*.(ts|svelte)": () => "yarn run check",
  "!(apps/)**/*.(js|cjs|mjs|ts|svelte)": (filenames) => [
    `eslint --ext .js,.cjs,.ts,.svelte --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
  // TODO lint apps/*
};
