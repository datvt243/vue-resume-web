<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, toRef, defineEmits, defineProps, watch } from 'vue'

const emits = defineEmits(['modelValue:update'])
const props = defineProps({
    title: { type: String, default: 'Title' },
    handleAction: { type: Function, default: () => {} },
    modelValue: { type: Array, default: () => [] },
})

const tags = toRef(props, 'modelValue')
const tag = ref('')
async function addTag() {
    tags.value.push(tag.value)
    await props.handleAction(tags.value)
    tag.value = ''
}

async function removeTag(tag) {
    tags.value = tags.value.filter(i => i !== tag)
    await props.handleAction(tags.value)
}
watch(tags, val => {
    emits('modelValue:update', val)
})
</script>

<template>
    <div class="clearfix">
        <div class="d-flex align-items-center mb-3">
            <p class="h6 m-0">{{ props.title }}</p>
            <div class="ps-4 m-0">
                <div class="input-group input-group-sm mb-0">
                    <input type="text" class="form-control" placeholder="Thêm mới" v-model="tag" />
                    <button class="btn btn-outline-success" type="button" @click="addTag()">
                        <FontAwesomeIcon icon="fa-solid fa-plus" />
                    </button>
                </div>
            </div>
        </div>
        <ul class="tag-list">
            <li v-for="(tag, i) in tags" :key="`tag${i}`">
                <span class="badge text-bg-secondary">
                    {{ tag }}
                    <span class="text-danger pointer" @click="removeTag(tag)"><FontAwesomeIcon icon="fa-solid fa-times" /></span>
                </span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.tag-list {
    padding: 0;
    margin: 0;
    display: inline-flex;
    list-style: none;
}
.tag-list li {
    margin: 0 10px 10px 0;
}
</style>
