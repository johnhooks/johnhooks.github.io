module.exports = {
  // '**/*.ts': () => 'yarn test:types',
  "**/*.(ts|js)": (filenames) => [
    `eslint --ext .js,.cjs,.ts,.svelte --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
};
