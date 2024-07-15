import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
const base = process.env.BASE_URL || '/'

export default defineConfig({
    plugins: [vue()],
    base: base,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // Alias cho thư mục src
            components: path.resolve(__dirname, 'src/components'), // Alias cho thư mục components
            views: path.resolve(__dirname, 'src/views'), // Alias cho thư mục views
        },
    },
})
