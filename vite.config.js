import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: false,
    // 必要に応じて他の設定を追加
  },
});
