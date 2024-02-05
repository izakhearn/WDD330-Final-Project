import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base : "https://izakhearn.github.io/WDD330-Final-Project/",
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
