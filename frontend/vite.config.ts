import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  base: mode === "web" ? "/NotesOnPDF/" : "/",
  build: {
    outDir: mode === "web" ? "dist/web" : "dist/desktop",
    chunkSizeWarningLimit: 1500,
  },
}));
