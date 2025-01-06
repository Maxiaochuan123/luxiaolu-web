import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import createVitePlugins from './vite/plugins'
// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_BASE, VITE_APP_PROXY_URL } = env
  return defineConfig({
    base: VITE_APP_BASE,
    server: {
      host: true,
      open: true, // 自动打开浏览器
      cors: true,
      proxy: {
        '/api': {
          target: VITE_APP_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/')
        }
      }
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, './'),
        "@": resolve(__dirname, "./src"),
        "components": resolve(__dirname, "./src/components"),
        "styles": resolve(__dirname, "./src/styles"),
        "utils": resolve(__dirname, "./src/utils"),
      }
    },
    plugins: createVitePlugins(env, command === 'build'),
  })
}
