/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            //https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
            // https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
            code: {
              fontWeight: "400",
              color: theme("colors.black"),
              // backgroundColor: theme("colors.white"),
              // paddingTop: em(6, 16),
              // paddingRight: em(10, 16),
              // paddingBottom: em(6, 16),
              // paddingLeft: em(10, 16),
              // borderRadius: rem(6),
              // border: "1px solid #dddddd"
            },
            // https://github.com/tailwindlabs/tailwindcss-typography/issues/18#issuecomment-733045571
            // "code::before": {
            //   content: '""'
            // },
            // "code::after": {
            //   content: '""'
            // }
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
