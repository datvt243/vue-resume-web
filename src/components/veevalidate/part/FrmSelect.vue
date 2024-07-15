<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { useField } from 'vee-validate'
import { defineProps, useAttrs, computed, watch } from 'vue'

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
    options: {
        type: Array,
        default: () => [],
    },
    value: { type: [String, Number], default: '' },
})
watch(
    () => props.value,
    (val) => {
        value.value = val
    },
)

/**
 *
 */
const attrs = useAttrs()

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name)

const getPlaceholder = computed(() => {
    const text = 'Vui lòng nhập'
    return props.placeholder ? props.placeholder : `${text} ${props.label.toLowerCase()}`
})
</script>

<template>
    <div class="mb-3">
        <label :for="props.name" class="form-label">{{ props.label }}</label>
        <select
            :id="props.name"
            :class="['form-control', props.size]"
            :value="value"
            v-bind="attrs"
            :data-value="value"
            @input="handleChange"
            @blur="handleBlur"
        >
            <option value="">Vui lòng chọn</option>
            <option v-for="el of options" :key="`opt_${el.value}`" :value="el.value">{{ el.text }}</option>
        </select>

        <p v-if="errorMessage" class="text-danger small my-1">{{ errorMessage }}</p>
        <p v-if="props.text" class="form-text mb-0">{{ props.text }}</p>
    </div>
</template>
