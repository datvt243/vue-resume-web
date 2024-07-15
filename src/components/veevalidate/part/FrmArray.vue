<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { useField, useFieldArray } from 'vee-validate'
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
    value: { type: [String, Number, Date], default: '' },
})
watch(
    () => props.value,
    val => {
        value.value = val
    },
)

const attrs = useAttrs()

const { value, errorMessage, handleChange, handleBlur } = useField(() => props.name)

const getPlaceholder = computed(() => {
    const text = 'Vui lòng nhập'
    return props.placeholder ? props.placeholder : `${text} ${props.label.toLowerCase()}`
})
</script>

<template>
    <div class="mb-3">
        <label v-if="props.label" :for="props.name" class="form-label">{{ props.label }}</label>
        <FieldArray name="links" v-slot="{ fields, push, remove }">
            <div v-for="(field, idx) in fields" :key="field.key">
                <Field :name="`links[${idx}].url`" type="url" />
                <button type="button" @click="remove(idx)">Remove</button>
            </div>
            <button type="button" @click="push({ id: Date.now(), name: '', url: '' })">Add</button>
        </FieldArray>
        <p v-if="errorMessage" class="text-danger small my-1">{{ errorMessage }}</p>
        <p v-if="props.text" class="form-text mb-0">{{ props.text }}</p>
    </div>
</template>
