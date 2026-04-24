import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
});
