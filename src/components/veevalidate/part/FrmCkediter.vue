<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import CKEditor from '@/components/ckeditor/CKEditor.vue'
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

function _handleChange($event) {
    const _val = $event
    handleChange(_val)
}
</script>

<template>
    <div class="mb-3">
        <label v-if="props.label" :for="props.name" class="form-label">{{ props.label }}</label>
        <CKEditor :model-value="value" @update:model-value="_handleChange" />
        <p v-if="errorMessage" class="text-danger small my-1">{{ errorMessage }}</p>
        <p v-if="props.text" class="form-text mb-0">{{ props.text }}</p>
    </div>
</template>
