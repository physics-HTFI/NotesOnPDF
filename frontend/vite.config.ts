import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  base: mode === "web" ? "/NotesOnPDF/" : "/",
  build: {
    outDir: mode === "web" ? "dist/web" : "dist/desktop",
    chunkSizeWarningLimit: 1500,
  },
}));
