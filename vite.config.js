import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-portfolio/', // TODO: 如果你的仓库名不是 my-portfolio，请修改这里。如果是部署到 username.github.io，请改为 '/'
})
