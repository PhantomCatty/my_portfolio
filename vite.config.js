import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my_portfolio/', // 仓库名是 my_portfolio (下划线)，不是 my-portfolio (短横线)
})
