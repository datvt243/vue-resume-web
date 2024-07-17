<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineProps, defineEmits, computed } from 'vue'
import type { PropType } from 'vue'
import type { Education } from '@/types/education.type'
import { formatDate } from '@/utilities/index'

const emits = defineEmits(['onEdit', 'onDelete'])
const props = defineProps({
    modelValue: {
        type: Object as PropType<Education>,
        default: () => ({
            _id: '',
            school: '',
            major: '',
            startDate: +new Date(),
            endDate: +new Date(),
            isCurrent: false,
            description: '',
            image: '',
        }),
    },
})
const model = computed(() => props.modelValue)
const getDate = computed(() => {
    const { startDate, endDate, isCurrent } = props.modelValue
    const _start = formatDate(startDate, 'MM/YYYY')
    const _end = isCurrent ? 'Hiện tại' : formatDate(endDate, 'MM/YYYY')
    return `${_start} - ${_end}`
})

const item = computed(() => ({
    title: model.value.school,
    subTitle: model.value.major,
    date: getDate.value,
    description: model.value.description,
}))
</script>

<template lang="pug">
ItemTemplate(:model-value="item")
    .btn-group
        a.btn.btn-sm.btn-outline-danger.icon(href="javascript:void(0)" @click="emits('onDelete', {...model})")
            FontAwesomeIcon(icon="fa-solid fa-trash")
        a.btn.btn-sm.btn-outline-warning.icon(href="javascript:void(0)" @click="emits('onEdit', {...model})")
            FontAwesomeIcon(icon="fa-solid fa-square-pen")
</template>
