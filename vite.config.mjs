import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  build: {
    outDir: "../dist/",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        play: resolve(__dirname, "src/play/index.html"),
      },
    },
  },
});
