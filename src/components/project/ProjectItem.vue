<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { PropType } from 'vue'

import { formatDateMMYYYY } from '@/utilities/index'

const emits = defineEmits(['onEdit', 'onDelete'])
const props = defineProps({
    modelValue: {
        type: Object as PropType<{
            _id: string
            name: string
            position: string
            technology: string
            startDate: number
            endDate: number
            isWorking: boolean
            description: string
            link?: string
            image?: string
        }>,
        default: () => ({
            _id: '',
            name: '',
            position: '',
            technology: '',
            startDate: +new Date(),
            endDate: +new Date(),
            isWorking: false,
            description: '',
            link: '',
            image: '',
        }),
    },
})
const model = computed(() => props.modelValue)
const getDate = computed(() => {
    const { startDate, endDate, isWorking } = props.modelValue
    const _start = formatDateMMYYYY(startDate)
    const _end = isWorking ? 'Hiện tại' : formatDateMMYYYY(endDate)
    return `${_start} - ${_end}`
})

const item = computed(() => ({
    title: model.value.name,
    subTitle: model.value.position,
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
    template(#sub)
        slot(name="sub")
</template>
