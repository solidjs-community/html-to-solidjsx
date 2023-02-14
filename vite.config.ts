import solid from "solid-start/vite";
import { defineConfig } from "vite";
import UnoCss from "unocss/vite";

export default defineConfig({
  base: "/html-to-solidjsx/",
  optimizeDeps: {
    // Add both @codemirror/state and @codemirror/view to included deps to optimize
    include: ["@codemirror/state", "@codemirror/view"],
  },
  plugins: [
    solid({
      adapter: "solid-start-static",
    }),
    UnoCss(),
  ],
  build: {
    assetsDir: "./",
  },
});
