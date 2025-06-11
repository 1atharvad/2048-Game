import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'src/renderer',
  base: '/projects/game-2048/',
  plugins: [react()],
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
  },
})