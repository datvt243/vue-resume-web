import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitest.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'text-summary'],
            // issue #7's own target is "business logic" — stores +
            // composables + utilities — not full-app coverage. Vue
            // components (.vue) are excluded here since most have no
            // tests yet and would just noise-drop the % without being
            // part of the stated target.
            include: ['src/utilities/**', 'src/stores/**', 'src/composables/**'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
