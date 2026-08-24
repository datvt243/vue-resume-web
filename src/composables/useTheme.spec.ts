import { describe, it, expect, beforeEach, vi } from 'vitest'

// `useTheme.ts` applies the theme as a side effect at module-load time and
// keeps a module-scoped ref, so each test needs a fresh module instance —
// `vi.resetModules()` + dynamic `import()` per test, rather than a single
// top-level import.
async function freshUseTheme() {
    vi.resetModules()
    return await import('./useTheme')
}

function mockMatchMedia(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation(query => ({
            matches,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        })),
    })
}

describe('useTheme', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.removeAttribute('data-bs-theme')
        // simulate a browser without matchMedia support unless a test opts in —
        // this is the exact case that used to throw before the `?.matches` fix
        Object.defineProperty(window, 'matchMedia', { writable: true, configurable: true, value: undefined })
    })

    it('defaults to light when there is no saved preference and matchMedia is unavailable', async () => {
        const { useTheme } = await freshUseTheme()
        const { theme } = useTheme()
        expect(theme.value).toBe('light')
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light')
    })

    it('falls back to the OS preference (matchMedia) when there is no saved value', async () => {
        mockMatchMedia(true)
        const { useTheme } = await freshUseTheme()
        const { theme } = useTheme()
        expect(theme.value).toBe('dark')
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark')
    })

    it('a saved localStorage preference wins over the OS preference', async () => {
        localStorage.setItem('theme', 'light')
        mockMatchMedia(true) // OS says dark, but the saved value should win
        const { useTheme } = await freshUseTheme()
        const { theme } = useTheme()
        expect(theme.value).toBe('light')
    })

    it('toggleTheme flips the value, persists it, and updates the data-bs-theme attribute', async () => {
        const { useTheme } = await freshUseTheme()
        const { theme, toggleTheme } = useTheme()

        expect(theme.value).toBe('light')
        toggleTheme()
        expect(theme.value).toBe('dark')
        expect(localStorage.getItem('theme')).toBe('dark')
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark')

        toggleTheme()
        expect(theme.value).toBe('light')
        expect(localStorage.getItem('theme')).toBe('light')
        expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light')
    })

    it('state is shared across every useTheme() call within the same module instance', async () => {
        const { useTheme } = await freshUseTheme()
        const a = useTheme()
        const b = useTheme()

        a.toggleTheme()

        expect(b.theme.value).toBe('dark')
    })
})
