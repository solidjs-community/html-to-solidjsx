import { presetWind, theme } from "@unocss/preset-wind";
import {
  transformerDirectives,
  defineConfig,
  transformerVariantGroup,
} from "unocss";

const parseValue = (value: string) => {
  return value.replace(/_/g, " ");
};
// mask-image-[linear-gradient(135deg,#000_calc(50%_-_1px),transparent_calc(50%_-_1px))]
export default defineConfig({
  rules: [
    [
      /^bg-image-\[(.+)\]$/,
      ([_, d]) => ({ "background-image": parseValue(d) }),
    ],
    [/^transition-prop-\[(.+)\]$/, ([_, d]) => ({ transition: parseValue(d) })],
    [
      /^mask-image-\[(.+)\]$/,
      ([_, d]) => ({
        "-webkit-mask-image": parseValue(d),
        "mask-image": parseValue(d),
      }),
    ],
  ],
  theme: {
    breakpoints: {
      ...theme.breakpoints,
      md: "850px",
    },
    colors: {
      brand: {
        default: "#2c4f7c",
        dark: "#335d92",
        medium: "#446b9e",
        light: "#4f88c6",
      },
      solid: {
        default: "#2c4f7c",
        darkbg: "#222222",
        darkLighterBg: "#444444",
        darkdefault: "#b8d7ff",
        darkgray: "#252525",
        gray: "#414042",
        mediumgray: "#9d9d9d",
        lightgray: "#f3f5f7",
        dark: "#07254A",
        medium: "#446b9e",
        light: "#4f88c6",
        accent: "#0cdc73",
        secondaccent: "#0dfc85",
      },
      other: "#1e1e1e",
    },
    fontFamily: {
      sans: "Gordita, " + theme.fontFamily!.sans,
    },
  },
  presets: [presetWind()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
