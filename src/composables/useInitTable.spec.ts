import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useInitTable } from './useInitTable'
import type { modelItem } from '@/types/model.type'

const fields: modelItem[] = [
    { name: 'name', label: 'Name', type: 'text', default: '', convertTo: 'truncate', cellClass: 'text-start' },
    { name: 'age', label: 'Age', type: 'number', default: 0 },
] as unknown as modelItem[]

describe('useInitTable', () => {
    it('maps each field to a column, defaulting convert.to to "text" when convertTo is absent', () => {
        const { columns } = useInitTable(fields)

        expect(columns.value).toEqual([
            { field: 'name', label: 'Name', convert: { to: 'truncate' }, className: 'text-start', type: 'text', name: 'name' },
            { field: 'age', label: 'Age', convert: { to: 'text' }, className: '', type: 'number', name: 'age' },
        ])
    })

    it('accepts a plain array (not just a Ref) via toValue', () => {
        const { columns } = useInitTable(fields)

        expect(columns.value).toHaveLength(2)
    })

    it('is reactive to a Ref source — TableDefault.vue passes toRef(props.settings)', () => {
        const settings = ref<modelItem[]>([fields[0]])
        const { columns } = useInitTable(settings)

        expect(columns.value).toHaveLength(1)
        expect(columns.value[0].field).toBe('name')

        settings.value = fields
        expect(columns.value).toHaveLength(2)
        expect(columns.value[1].field).toBe('age')
    })

    it('returns an empty array for an empty settings list', () => {
        const { columns } = useInitTable([])

        expect(columns.value).toEqual([])
    })
})
