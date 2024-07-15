<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, defineProps, defineExpose, onMounted, useSlots } from 'vue'
import { Modal } from 'bootstrap'

const slots = useSlots()

const props = defineProps({
    title: { type: String, default: 'Modal Title' },
    size: { type: String, default: 'modal-lg' },
    isHiddenFooter: { type: Boolean, default: false },
})

const refModal = ref(null)

let modalBootstrap = null
onMounted(() => {
    modalBootstrap = new Modal(refModal.value, {})
})

function show() {
    modalBootstrap?.show()
}
function hide() {
    modalBootstrap?.hide()
}
defineExpose({
    show,
    hide,
})
</script>

<template>
    <div class="modal draggable" tabindex="-1" ref="refModal" data-backdrop="static">
        <div class="modal-dialog modal-dialog-scrollable" :class="props.size">
            <div class="modal-content">
                <div class="modal-header">
                    <p class="modal-title h5 m-0">{{ props.title }}</p>
                    <span class="ms-auto">
                        <span class="btn btn-sm btn-outline-danger" data-bs-dismiss="modal" aria-label="Close">
                            <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        </span>
                    </span>
                </div>
                <div class="modal-body">
                    <template v-if="slots?.default">
                        <slot></slot>
                    </template>
                    <p v-else>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, facilis!</p>
                </div>
                <div class="modal-footer" v-if="!isHiddenFooter">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <template v-if="slots?.footer"><slot name="footer"></slot></template>
                </div>
            </div>
        </div>
    </div>
</template>
