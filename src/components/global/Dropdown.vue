<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, defineProps, computed, onMounted } from 'vue'
import { Dropdown } from 'bootstrap'

const props = defineProps({
    style: { type: String, default: 'primary' },
    text: { type: String, default: 'Dropdown button' },
    href: { type: String, default: '' },
    split: { type: Boolean, default: false },
    btnSize: { type: String, default: '' },
    isSm: { type: Boolean, default: '' },
})

const refDropdown = ref(null)
onMounted(() => {
    refDropdown?.value && new Dropdown(refDropdown?.value)
})

const attrBtnToggle = computed(() => {
    const className = `btn btn-${props.style} ${!props.split ? 'dropdown-toggle' : ''} ${props.btnSize}`
    return {
        class: className,
        'data-bs-toggle': 'dropdown',
        'aria-expanded': 'false',
        ref: 'refDropdown',
    }
})
</script>

<template>
    <div :class="['dropdown', { 'btn-group': props.split, 'btn-group-sm': props.isSm }]">
        <template v-if="props.href">
            <a v-if="text" :href="props.href" role="button" v-bind="attrBtnToggle"> {{ props.text }} </a>
        </template>
        <template v-else>
            <button v-if="text" type="button" :class="['btn', `btn-${props.style}`]" v-html="props.text"></button>
        </template>
        <template v-if="props.split">
            <button
                type="button"
                :class="['btn dropdown-toggle dropdown-toggle-split', `btn-${props.style}`]"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <span class="visually-hidden">{{ props.text }}</span>
            </button>
        </template>
        <ul class="dropdown-menu">
            <slot></slot>
        </ul>
    </div>
</template>
