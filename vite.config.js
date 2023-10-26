import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3001
    port: 3000,
    proxy: {
      "/api": "http://localhost:3001",
      "/Images": "http://localhost:3001",
    },
  },
  // build: {
  //   // generate manifest.json in outDir
  //   manifest: true,
  //   rollupOptions: {
  //     // overwrite default .html entry
  //     input: "/server/server.js",
  //   },
  // },
});
