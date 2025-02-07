import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        client: "./room.html",
        admin: "./admin.html",
      },
    },
    outDir: "../server/public",
  },
});
