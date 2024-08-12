import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gray: {
            50: "#f5f6f7",
            200: "#e0e2e4",
            400: "#bcbfc1",
            600: "#7c7f86",
            800: "#40444c",
            1000: "#18181b",
          },
          primary: {
            50: "#e9f5fe",
            100: "#bce1fd",
            200: "#9cd2fc",
            300: "#6ebefb",
            400: "#52b1fa",
            500: "#279ef9",
            600: "#2390e3",
            700: "#1c70b1",
            800: "#155189",
            900: "#103769",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      mobile: "375px",
      desktop: "1280px",
    },
  },
  plugins: [],
};
export default config;
