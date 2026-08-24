import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { authStore } from './auth'
import { candidateStore } from './candidate'

describe('authStore', () => {
    beforeEach(() => {
        localStorage.clear()
        setActivePinia(createPinia())
    })

    it('starts unauthenticated with no token in localStorage', () => {
        const store = authStore()
        expect(store.isAuthenticated).toBe(false)
        expect(store.getToken).toBe('')
    })

    it('reads an existing token from localStorage on creation', () => {
        localStorage.setItem('token', 'seeded-token')
        const store = authStore()
        expect(store.getToken).toBe('seeded-token')
        expect(store.isAuthenticated).toBe(true)
    })

    it('setToken updates both the store and localStorage', () => {
        const store = authStore()
        store.setToken('abc123')
        expect(store.getToken).toBe('abc123')
        expect(store.isAuthenticated).toBe(true)
        expect(localStorage.getItem('token')).toBe('abc123')
    })

    it('setRefreshToken updates both the store and localStorage', () => {
        const store = authStore()
        store.setRefreshToken('refresh123')
        expect(store.getRefreshToken).toBe('refresh123')
        expect(localStorage.getItem('tokenRefresh')).toBe('refresh123')
    })

    it('setUser merges into the reactive user and persists to localStorage', () => {
        const store = authStore()
        store.setUser({ name: 'Dat', email: 'dat@example.com' })
        expect(store.getUser).toEqual({ name: 'Dat', email: 'dat@example.com' })
        expect(JSON.parse(localStorage.getItem('user') as string)).toEqual({ name: 'Dat', email: 'dat@example.com' })
    })

    it('clearUser empties the reactive user object (issue #38 regression)', () => {
        const store = authStore()
        store.setUser({ name: 'Dat' })
        store.clearUser()
        expect(store.getUser).toEqual({})
    })

    it('logOut clears localStorage, resets token/refreshToken/user, and cleans the candidate store', () => {
        const store = authStore()
        store.setToken('tok')
        store.setRefreshToken('reftok')
        store.setUser({ name: 'Dat' })

        const candidate = candidateStore()
        candidate.setCandidate({ _id: '1', name: 'resume' })

        store.logOut()

        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('tokenRefresh')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
        expect(store.getToken).toBe('')
        expect(store.getRefreshToken).toBe('')
        expect(store.getUser).toEqual({})
        expect(store.isAuthenticated).toBe(false)
        expect(candidate.getCandidate).toEqual({ gender: 0, marital: 0 })
    })

    it('logOut navigates to /login when a router is passed', () => {
        const store = authStore()
        const push = vi.fn()
        store.logOut({ router: { push } })
        expect(push).toHaveBeenCalledWith('/login')
    })

    it('logOut does not throw when called without a router', () => {
        const store = authStore()
        expect(() => store.logOut()).not.toThrow()
    })
})
