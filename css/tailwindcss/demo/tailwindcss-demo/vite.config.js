import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // react 插件
import tailwindcss from "@tailwindcss/vite"; // tailwindcss插件

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
