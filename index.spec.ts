import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'

describe('index.html', () => {
    it('does not hardcode data-bs-theme on <body> (regression guard for issue #62: a hardcoded `<body data-bs-theme="dark">` silently overrode whatever useTheme.ts set on <html>, making the dark-mode toggle a visible no-op)', () => {
        const html = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8')
        const bodyTagMatch = html.match(/<body[^>]*>/)

        expect(bodyTagMatch).not.toBeNull()
        expect(bodyTagMatch?.[0]).not.toMatch(/data-bs-theme/)
    })
})
