import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Set the port to 3000
  },
  plugins: [react()],
});
