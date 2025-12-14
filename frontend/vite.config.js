import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Soundstruct frontend.  This file tells Vite
// to use the React plugin and leaves most settings at their defaults.  When
// deployed on Render, the build command "vite build" will produce a
// production-ready static site in the "dist" directory.

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});
