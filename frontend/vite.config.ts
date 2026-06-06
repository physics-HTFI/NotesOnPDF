import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  base: "/NotesOnPDF/",
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500,
  },
}));
