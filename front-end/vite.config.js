import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      UnoCSS()
  ],
  resolve:{
      alias:{
          '@':resolve('src')
      }
    }
})

