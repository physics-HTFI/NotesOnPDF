import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "web" ? "/NotesOnPDF/" : "/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
