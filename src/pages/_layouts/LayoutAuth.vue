<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import Header from '@/pages/_layouts/Header.vue'
import Footer from '@/pages/_layouts/Footer.vue'

import { ref } from 'vue'
</script>

<template lang="pug">
.body-container 
    Header(:is-login="false")
    main.main-container.py-4
        #reload
        .container
            slot
    Footer
</template>

<style scoped lang="scss">
.body-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .main-container {
        flex-grow: 1;
    }
}
</style>
