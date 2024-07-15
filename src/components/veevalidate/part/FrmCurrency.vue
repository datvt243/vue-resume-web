<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { useField } from 'vee-validate'
import { defineProps, useAttrs, computed, watch } from 'vue'
import { component as VueNumber } from '@coders-tm/vue-number-format'

const props = defineProps({
    name: String,
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    text: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    size: { type: String, default: '' },
    validFeedback: { type: String, default: '' },
    invalidFeedback: { type: String, default: '' },
    rules: { type: String, default: '' },
    value: { type: [String, Number, Date], default: '' },
})
watch(
    () => props.value,
    (val) => {
        value.value = val
    },
)

const attrs = useAttrs()

const format = {
    decimal: '.',
    separator: ',',
    prefix: 'VND ',
    precision: 2,
    masked: false,
}

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name)
value.value = 0
const getPlaceholder = computed(() => {
    const text = 'Vui lòng nhập'
    return props.placeholder ? props.placeholder : `${text} ${props.label.toLowerCase()}`
})
function _handleChange($event) {
    const number = $event
    handleChange(+number)
}
</script>

<template>
    <div class="mb-3">
        <label :for="props.name" class="form-label">{{ props.label }}</label>
        <VueNumber
            :model-value="value"
            @update:model-value="_handleChange"
            v-bind="format"
            :id="props.name"
            class="form-control"
        />
        <!-- <input
            class="form-control"
            :value="value"
            :type="props.type"
            :id="props.name"
            :placeholder="getPlaceholder"
            :class="[props.size]"
            v-bind="attrs"
            @input="handleChange"
            @blur="handleBlur"
        /> -->
        <p v-if="errorMessage" class="text-danger small my-1">{{ errorMessage }}</p>
        <p v-if="props.text" class="form-text mb-0">{{ props.text }}</p>
    </div>
</template>
