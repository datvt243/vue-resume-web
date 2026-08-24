import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitest.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
