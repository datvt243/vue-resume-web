/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, reactive, toRefs, onMounted, toValue } from 'vue'

import type { modelItem } from '@/types/model.type'

interface Columns {
    field: string
    label: string
    convert: {
        to: string
    }
    className: string
}
export const useInitTable = (settings: modelItem[]) => {
    const columns = ref<Columns[]>([])

    onMounted(() => {
        columns.value = [...toValue(settings)].map(s => ({
            field: s?.name,
            label: s?.label,
            convert: {
                to: s?.convertTo || 'text',
            },
            className: s?.cellClass || '',
            type: s?.type || '',
            name: s?.name || '',
        }))
    })

    return {
        columns,
    }
}
