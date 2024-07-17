/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { Response } from '@/types/api.type'
import { ref, onBeforeMount, toValue, computed } from 'vue'
import { candidateStore } from '@/stores/candidate'
import { handleBase } from '@/services/base'
import { useHelper } from '@/composables/useHepler'

interface Props {
    field: string
    collection?: string | null
}
type Result = Record<string, any>[] | Record<string, any>
export const useCandidate = (props: Props) => {
    const candidate = candidateStore()
    const field = ref(props.field)
    const collection = props.collection || null

    const result = ref<Result>([])

    const canidateId = computed(() => candidate.getId)
    const { loading } = useHelper()

    onBeforeMount(async () => {
        let _result: Result = candidate.getCandidateByField(toValue(field))

        if (!_result.length) {
            await getData()
        } else {
            result.value = _result
        }
    })

    async function getData() {
        let _data: Result = []
        const _collection = (() => {
            if (collection) return collection
            return field.value.endsWith('s') ? field.value.slice(0, -1) : field.value
        })()

        await handleBase(
            {
                method: 'get',
                url: `${_collection}/`,
            },
            { loading: loading, toast: null },
            (res: Response) => {
                const { data = [] } = res
                _data = data
                candidate.setCandidateByField({
                    [`${field.value}`]: data,
                })
            },
        )

        result.value = _data
        /* return _data */
    }

    function removeRecordById(_id: string) {
        result.value = result.value.filter(e => e._id !== _id)

        candidate.setCandidateByField({
            [field.value]: toValue(result),
        })
    }
    function addRecordToList(data: { _id: string; [key: string]: any }) {
        const { _id = null } = data

        if (!_id) {
            result.value.push(data)
            return
        }
        const _findIndex = result.value.findIndex(e => e._id === _id)

        if (_findIndex > -1) {
            result.value[_findIndex] = data
        } else {
            result.value.push(data)
        }

        candidate.setCandidateByField({
            [field.value]: toValue(result),
        })
    }
    function updateField(props: { field: string; values: String | Record<string, any> | Record<string, any>[] }) {
        const { field, values } = props
        const _f = field

        if (_f === '')
            candidate.setCandidateByField({
                [_f]: values,
            })
    }
    function updateGeneralInformationByField(value: Record<string, any>) {
        candidate.setGeneralInformation(value)
    }

    return {
        canidateId,
        [toValue(field)]: result,
        removeRecordById,
        addRecordToList,
        updateField,
        updateGeneralInformationByField,
        getData,
    }
}
