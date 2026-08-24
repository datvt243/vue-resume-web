import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useDocument } from './useDocument'
import type { modelItem } from '@/types/model.type'

const handleBaseMock = vi.fn()
vi.mock('@/services/base', () => ({
    handleBase: (...args: unknown[]) => handleBaseMock(...args),
}))

vi.mock('@/composables/useHelper', () => ({
    useHelper: () => ({ loading: ref(null), toast: vi.fn() }),
}))

const confirmDeleteMock = vi.fn()
vi.mock('@/lib/swal.lib', () => ({
    confirmDelete: (...args: unknown[]) => confirmDeleteMock(...args),
}))

const fields: modelItem[] = [
    { name: 'name', label: 'Name', type: 'text', default: '' },
    { name: 'age', label: 'Age', type: 'number', default: 0 },
] as unknown as modelItem[]

// `onBeforeMount` inside the composable needs an active component instance —
// mount a throwaway component that just calls useDocument() in setup().
function withUseDocument(collection = 'education') {
    let result!: ReturnType<typeof useDocument>
    const wrapper = mount(
        defineComponent({
            setup() {
                result = useDocument({ fields, collection })
                return () => h('div')
            },
        }),
    )
    return { result, wrapper }
}

describe('useDocument', () => {
    beforeEach(() => {
        handleBaseMock.mockReset()
        confirmDeleteMock.mockReset()
    })

    it('initializes document/documentInterface from each field default', () => {
        const { result } = withUseDocument()
        expect(result.document).toEqual({ name: '', age: '' })
        expect(result.documentInterface).toEqual({ name: '', age: '' })
    })

    it('a falsy-but-valid default (0, false) is overwritten to "" by `f.default || \'\'` — documents a real quirk, not asserting it is correct', () => {
        // getValue() in useDocument.ts uses `f.default || ''`, so any falsy
        // default (0, false, '') collapses to '' — a numeric default of 0
        // can never actually be used as the initial value. Logged as
        // "Noticed, not done" in the evidence note; not fixed here (out of
        // this task's scope).
        const { result } = withUseDocument()
        expect(result.document.age).toBe('')
    })

    it('updateDoc POSTs to create when the record has no _id', async () => {
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.updateDoc({ name: 'Dat' }, callback)

        expect(handleBaseMock).toHaveBeenCalledTimes(1)
        const [axiosOpt] = handleBaseMock.mock.calls[0]
        expect(axiosOpt).toMatchObject({ method: 'post', url: 'education/create', data: { name: 'Dat', _id: null } })
    })

    it('updateDoc PUTs to update when the record already has an _id', async () => {
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.updateDoc({ _id: 'e1', name: 'Dat' }, callback)

        const [axiosOpt] = handleBaseMock.mock.calls[0]
        expect(axiosOpt).toMatchObject({ method: 'put', url: 'education/update', data: { _id: 'e1', name: 'Dat' } })
    })

    it('updateDoc forwards the response to the caller callback', async () => {
        handleBaseMock.mockImplementation(async (_opt, _props, cb) => cb({ success: true, message: 'ok', data: {} }))
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.updateDoc({ name: 'Dat' }, callback)

        expect(callback).toHaveBeenCalledWith({ success: true, message: 'ok', data: {} })
    })

    it('updatePatchDoc always PATCHes to update', async () => {
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.updatePatchDoc({ _id: 'e1', name: 'Dat' }, callback)

        const [axiosOpt] = handleBaseMock.mock.calls[0]
        expect(axiosOpt).toMatchObject({ method: 'patch', url: 'education/update', data: { _id: 'e1', name: 'Dat' } })
    })

    it('deleteDoc only calls handleBase after the confirm dialog confirms', async () => {
        confirmDeleteMock.mockImplementation(({ callback }) => callback())
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.deleteDoc({ _id: 'e1', name: 'Dat' }, 'name', callback)

        expect(confirmDeleteMock).toHaveBeenCalledTimes(1)
        const [axiosOpt] = handleBaseMock.mock.calls[0]
        expect(axiosOpt).toMatchObject({ method: 'delete', url: 'education/delete/e1' })
    })

    it('deleteDoc never calls handleBase if the confirm dialog is not confirmed', async () => {
        confirmDeleteMock.mockImplementation(() => {
            // user cancelled — callback is never invoked
        })
        const { result } = withUseDocument('education')

        await result.deleteDoc({ _id: 'e1', name: 'Dat' }, 'name', vi.fn())

        expect(handleBaseMock).not.toHaveBeenCalled()
    })

    it('deleteDoc injects the deleted _id into the response data before the callback', async () => {
        confirmDeleteMock.mockImplementation(({ callback }) => callback())
        handleBaseMock.mockImplementation(async (_opt, _props, cb) => cb({ success: true, message: 'ok', data: {} }))
        const { result } = withUseDocument('education')
        const callback = vi.fn()

        await result.deleteDoc({ _id: 'e1', name: 'Dat' }, 'name', callback)

        expect(callback).toHaveBeenCalledWith({ success: true, message: 'ok', data: { _id: 'e1' } })
    })
})
