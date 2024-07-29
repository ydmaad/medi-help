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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        [".fc-button"]: {
          backgroundColor: "transparent",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
export default config;
