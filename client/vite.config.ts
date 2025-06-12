import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/app/",
  plugins: [svelte()],
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        client: "./room.html",
        admin: "./admin.html",
        login: "./login.html",
        "admin-login": "./admin-login.html",
      },
    },
    outDir: "../server/public",
    sourcemap: true,
  },
});
