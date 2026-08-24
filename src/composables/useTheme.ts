/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Dark/light theme toggle, backed by Bootstrap 5.3's
 * `data-bs-theme` attribute (issue #62). Shared module-scoped state so
 * every component using `useTheme()` reflects the same value.
 */

import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'theme'

function getPreferredTheme(): Theme {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    // No saved preference: honor an explicit OS "light" preference, but
    // otherwise fall back to dark — this matches the app's existing
    // default look (previously hardcoded as `<body data-bs-theme="dark">`
    // in index.html, which is what made the toggle a no-op before this
    // fix; see issue-62-dark-mode-body-attr-override).
    if (window.matchMedia?.('(prefers-color-scheme: light)')?.matches) return 'light'
    return 'dark'
}

function applyTheme(value: Theme) {
    document.documentElement.setAttribute('data-bs-theme', value)
}

const theme = ref<Theme>(getPreferredTheme())
// Apply immediately at module load (imported early from main.ts) so the
// persisted/preferred theme is set before the app renders.
applyTheme(theme.value)

export const useTheme = () => {
    function toggleTheme() {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem(THEME_KEY, theme.value)
        applyTheme(theme.value)
    }

    return {
        theme,
        toggleTheme,
    }
}
