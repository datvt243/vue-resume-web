import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useHelper } from './useHelper'

// useHelper.ts's `inject()` calls have no generic/type argument, so its
// return type is `{ loading: unknown, toast: unknown }` — cast to what
// App.vue actually provides (a boolean-ish Ref + a callback) so the test
// body can use `.value`/call it without fighting the untyped source.
interface HelperResult {
    loading: Ref<unknown> | undefined
    toast: ((_args: unknown) => void) | undefined
}

// `inject()` inside the composable needs an active component instance —
// mount a throwaway component that just calls useHelper() in setup(),
// providing 'spinner'/'toast' the same way App.vue does.
function withUseHelper(provide: Record<string, unknown> = {}) {
    let result!: HelperResult
    const wrapper = mount(
        defineComponent({
            setup() {
                result = useHelper() as unknown as HelperResult
                return () => h('div')
            },
        }),
        { global: { provide } },
    )
    return { result, wrapper }
}

describe('useHelper', () => {
    it('returns the exact provided spinner Ref, not a snapshot of its value', () => {
        // Regression guard for issue #9: useHelper() used to return
        // `toValue(refSpinner)` (a snapshot at call time) instead of the
        // Ref itself, silently losing reactivity for every caller.
        const refSpinner = ref(null)
        const { result } = withUseHelper({ spinner: refSpinner })

        expect(result.loading).toBe(refSpinner)
    })

    it('stays reactive to changes on the provided spinner Ref after injection', () => {
        const refSpinner = ref(false)
        const { result } = withUseHelper({ spinner: refSpinner })

        expect(result.loading?.value).toBe(false)
        refSpinner.value = true
        expect(result.loading?.value).toBe(true)
    })

    it('returns the exact provided toast function', () => {
        const toastFn = vi.fn()
        const { result } = withUseHelper({ toast: toastFn })

        expect(result.toast).toBe(toastFn)
        result.toast?.({ message: 'hi', bg: 'success' })
        expect(toastFn).toHaveBeenCalledWith({ message: 'hi', bg: 'success' })
    })

    it('does not throw when spinner/toast are not provided (returns undefined, no default)', () => {
        const { result } = withUseHelper()

        expect(result.loading).toBeUndefined()
        expect(result.toast).toBeUndefined()
    })
})
