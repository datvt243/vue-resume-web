<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import Header from '@/pages/_layouts/Header.vue'
import Footer from '@/pages/_layouts/Footer.vue'
import Main from '@/pages/_layouts/Main.vue'

import { ref } from 'vue'

const routers = [
    { text: 'Thông tin cơ bản', name: 'personal-information', to: '/dashboard/information' },
    { text: 'Thông tin chung', name: 'general-information', to: '/dashboard/general-information' },
    { text: 'Học vấn', name: 'education', to: '/dashboard/education' },
    { text: 'Kinh nghiệm', name: 'experience', to: '/dashboard/experience' },
    { text: 'Dự án', name: 'project', to: '/dashboard/project' },
    { text: 'Giải thưởng', name: 'award', to: '/dashboard/award' },
    { text: 'Chứng chỉ', name: 'certificate', to: '/dashboard/certificate' },
    { text: 'Người tham khảo', name: 'reference', to: '/dashboard/reference' },
]

function getRouterName(path) {
    const _find = routers.find(r => r.to === path)
    return _find ? _find.text : 'Home'
}
</script>

<template lang="pug">
.body-container 
    Header(:is-login="true")
    Main
        .container
            .clearfix.mb-4.border-bottom
                .d-flex
                    .col-auto.flex-grow-1
                        nav(aria-label="breadcrumb")
                            ol.breadcrumb.align-items-center
                                li.breadcrumb-item Dashboard
                                li.breadcrumb-item.text-capitalize(aria-current="page") 
                                    Dropdown(:text="getRouterName($route.path)" :style="'outline-light text-capitalize'" split is-sm)
                                        li.dropdown-item(v-for="r in routers" :key="r.name" :class="{ active: r.to === $route.fullPath }")
                                            RouterLink.nav-link(:to="r.to") {{ r?.text || r?.name }}
                    .col-auto
                        #reload
            .clearfix
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
