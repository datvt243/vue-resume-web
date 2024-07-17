<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineProps, computed } from 'vue'
import type { PropType } from 'vue'

interface Props {
    img?: string
    title: string
    subTitle: string
    date: string | (() => string)
    description: string
}
const props = defineProps({
    modelValue: {
        type: Object as PropType<Props>,
        default: () => ({
            img: '',
            title: '',
            subTitle: '',
            date: '',
            description: '',
        }),
    },
    icon: { type: String, default: 'fa-building' },
})
const model = computed(() => props.modelValue)

const getDate = computed(() => {
    if (typeof props.modelValue.date === 'string') {
        return props.modelValue.date
    }
    return props.modelValue?.date?.()
})
</script>

<template lang="pug">
.item.border.p-4.rounded
    .d-flex
        .flex-shrink-0.pe-3
            template(v-if="model?.image")
                img.image( :src="model.image" :alt="model.title") 
            template(v-else)
                span.image.opacity-75.d-inline-block.mt-2.text-center
                    FontAwesomeIcon(:icon="['fa-solid', `${ props.icon }`]")
        .col.flex-grow-1
            .d-flex.mb-3
                .col-auto
                    p.item-title {{ model.title }}
                .col-auto.ms-auto
                    slot
            div.border-start.ps-3.border-success.mb-3
                p.item-note(v-if="model.subTitle") {{ model.subTitle }}
                p.item-note(v-if="getDate") {{ getDate }}
                slot(name="sub")
            div.item-description.post-content(v-if="model.description" v-html="model.description")

</template>
