const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, "$1")
    .replace(/\.0$/, "");
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{src,scripts}/**/*.{html,js,md,svelte,ts}", "./mdsvex.config.js"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            pre: {},
            // https://github.com/tailwindlabs/tailwindcss-typography/issues/18#issuecomment-733045571
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              fontSize: em(14, 16),
              lineHeight: round(24 / 14),
              marginTop: em(24, 14),
              marginBottom: em(24, 14),
              borderRadius: rem(6),
              display: "flex",
              flexDirection: "column",
              padding: 0,
              boxShadow: theme("boxShadow.md"),
              "> code": {
                paddingTop: em(12, 14),
                paddingRight: em(16, 14),
                paddingBottom: em(12, 14),
                paddingLeft: em(16, 14),
              },
            },
          },
        },
        sm: {
          css: {
            "div.codeblock": {
              "p[data-language]": {
                marginBottom: 0,
              },
              pre: {
                marginTop: em(8, 12),
              },
            },
            pre: {
              fontSize: em(12, 14),
              lineHeight: round(20 / 12),
              marginTop: em(20, 12),
              marginBottom: em(20, 12),
              borderRadius: rem(4),
              display: "flex",
              flexDirection: "column",
              padding: 0,
              boxShadow: theme("boxShadow.sm"),
              "> code": {
                paddingTop: em(8, 12),
                paddingRight: em(12, 12),
                paddingBottom: em(8, 12),
                paddingLeft: em(12, 12),
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        lg: {
          css: {
            "div.codeblock": {
              "p[data-language]": {
                marginBottom: 0,
              },
              pre: {
                marginTop: em(8, 16),
              },
            },
            pre: {
              fontSize: em(16, 18),
              lineHeight: round(28 / 16),
              marginTop: em(32, 16),
              marginBottom: em(32, 16),
              borderRadius: rem(6),
              display: "flex",
              flexDirection: "column",
              padding: 0,
              boxShadow: theme("boxShadow.lg"),
              "> code": {
                paddingTop: em(16, 16),
                paddingRight: em(24, 16),
                paddingBottom: em(16, 16),
                paddingLeft: em(24, 16),
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        xl: {
          pre: {
            fontSize: em(18, 20),
            lineHeight: round(32 / 18),
            marginTop: em(36, 18),
            marginBottom: em(36, 18),
            borderRadius: rem(8),
            display: "flex",
            flexDirection: "column",
            padding: 0,
            boxShadow: theme("boxShadow.md"),
            "> code": {
              paddingTop: em(20, 18),
              paddingRight: em(24, 18),
              paddingBottom: em(20, 18),
              paddingLeft: em(24, 18),
            },
          },
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        "2xl": {
          css: {
            pre: {
              display: "flex",
              flexDirection: "column",
              padding: 0,
              boxShadow: theme("boxShadow.md"),
              fontSize: em(20, 24),
              lineHeight: round(36 / 20),
              marginTop: em(40, 20),
              marginBottom: em(40, 20),
              borderRadius: rem(8),
              "> code ": {
                paddingTop: em(24, 20),
                paddingRight: em(32, 20),
                paddingBottom: em(24, 20),
                paddingLeft: em(32, 20),
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
