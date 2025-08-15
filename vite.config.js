// vite.config.js
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools'; // ← named export!
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    imagetools(), // ← run this first
    react(), // ← then React’s plugin
  ],
});
