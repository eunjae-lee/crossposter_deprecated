import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env": "process.env",
  },
  build: {
    minify: false,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
