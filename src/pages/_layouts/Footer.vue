<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { ref } from 'vue'

const yearNow = new Date().getFullYear()
</script>

<template lang="pug">
footer.py-2.border-top
    .container.text-end.opacity-50
        small.small copyright by <a href="https://github.com/datvt243" target="_blank">me</a> &copy; {{ yearNow }}
</template>
