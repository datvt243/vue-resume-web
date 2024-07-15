<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref, defineExpose } from 'vue'

defineExpose({
    show,
    hide,
})

const isLoading = ref(false)

function show() {
    isLoading.value = true
}
function hide() {
    isLoading.value = false
}
</script>

<template>
    <div v-if="isLoading" class="spinner-container">
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-4 opacity-50">
            <span class="small"> SeverFree nên có thể sẽ chậm ở lần call API đầu tiên </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.spinner-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;

    background-color: rgba(51, 51, 51, 0.75);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ~ * {
        filter: blur(10px);
    }
}
</style>
