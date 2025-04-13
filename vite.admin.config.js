import { v4wp } from "@kucrut/vite-for-wp";
import react from "@vitejs/plugin-react";

import path from "path"

export default {
  plugins: [
    v4wp({
      input: "resources/js/admin/main.jsx",
      outDir: "assets/admin/dist",
    }),
    // wp_scripts(),
   
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./resources/js/admin"),
    },
  },
  server: {
    origin: 'http://localhost:5174', // optional, defaultnya sudah ini
    cors: {
      origin: '*', // atau bisa lebih ketat: ['http://your-wp.test']
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
};