module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["svelte3", "@typescript-eslint"],
  ignorePatterns: ["*.cjs"],
  overrides: [
    {
      files: ["**/*.(js|ts)"],
      plugins: ["import"],
      extends: ["prettier", "plugin:import/recommended", "plugin:import/typescript"],
      rules: {
        "import/order": [
          "error",
          {
            alphabetize: {
              order: "asc",
              caseInsensitive: true,
            },
            "newlines-between": "always",
            groups: ["builtin", "external", "parent", "sibling", "index"],
            pathGroups: [
              {
                pattern: "$lib/**/*",
                group: "parent",
                position: "before",
              },
            ],
            pathGroupsExcludedImportTypes: ["builtin"],
          },
        ],
      },
    },
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
      rules: {
        "import/no-unresolved": "off",
      },
    },
    {
      files: ["**/?(*.)+(spec|test).ts"],
      extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
    },
  ],
  settings: {
    "svelte3/typescript": () => require("typescript"),
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        projects: ["./"],
      },
    },
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
