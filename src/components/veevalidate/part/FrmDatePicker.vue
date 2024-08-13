<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import '@/styles/vue3datepicker.scss'

import { useField } from 'vee-validate'
import { ref, useAttrs, watch, computed } from 'vue'

const props = defineProps({
    name: String,
    label: { type: String, default: '' },
    text: { type: String, default: '' },
    rules: { type: String, default: '' },
    value: { type: Number, default: +new Date() },
})
const attrs = useAttrs()
const isMonthPicker = computed(() => Object.hasOwn(attrs, 'monthPicker'))

// ----- useField

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name)
watch(value, val => {
    handleChange(val)
    ;(() => {
        if (isMonthPicker.value) {
            const newDate = new Date(val)
            date.value = {
                month: newDate.getMonth(),
                year: newDate.getFullYear(),
            }
        } else {
            date.value = +new Date(value.value)
        }
    })()
})

// ----- useField
const initValue = () => {
    const _check = Object.hasOwn(attrs, 'monthPicker')
    const _val = value.value || +new Date()

    if (_check) {
        const newDate = new Date(_val)
        return {
            month: newDate.getMonth(),
            year: newDate.getFullYear(),
        }
    }
    return +new Date(value.value)
}
const date = ref(initValue())

// ------

const format = date => {
    let day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear()

    day = day < 10 ? `0${day}` : day
    month = month < 10 ? `0${month}` : month

    const { monthPicker = false } = attrs

    return !monthPicker ? `${day}/${month}/${year}` : `${month}/${year}`
}
</script>

<template>
    <div class="mb-3">
        <label :for="props.name" class="form-label">{{ props.label }}</label>

        <VueDatePicker
            dark
            :id="props.name"
            v-model="date"
            :enable-time-picker="false"
            :format="format"
            :month-picker="attrs.monthPicker || false"
            auto-apply
        ></VueDatePicker>

        <p v-if="errorMessage" class="text-danger small my-1">{{ errorMessage }}</p>
        <p v-if="props.text" class="form-text mb-0">{{ props.text }}</p>
    </div>
</template>
