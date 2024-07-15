<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, defineProps, defineExpose, onMounted, reactive } from 'vue'
import { Toast } from 'bootstrap'

defineExpose({
    show,
})

const props = defineProps({
    content: { type: String, default: '' },
    bg: { type: String, default: 'success' },
})

const refToast = ref(null)

let toastBootstrap = null
onMounted(() => {
    toastBootstrap = new Toast(refToast.value, {})
})

function show() {
    toastBootstrap?.show()
}
</script>

<template>
    <!-- <button type="button" class="btn btn-primary" id="liveToastBtn" @click="show()">Show live toast</button> -->

    <div class="toast-container position-fixed top-0 end-0 p-3">
        <div :class="`bg-${props.bg}`">
            <div ref="refToast" :class="['toast']" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto text-uppercase ls-2">Thông báo</strong>
                    <span class="ms-auto">
                        <span class="btn btn-sm btn-outline" data-bs-dismiss="toast" aria-label="Close">
                            <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        </span>
                    </span>
                </div>
                <div class="toast-body" v-html="props.content"></div>
            </div>
        </div>
    </div>
</template>
