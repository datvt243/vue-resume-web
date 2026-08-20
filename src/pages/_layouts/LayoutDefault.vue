<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

// eslint-disable-next-line no-unused-vars -- dùng trong <template lang="pug">, vue-eslint-parser không phân tích được usage trong pug nên báo false positive
import Header from '@/pages/_layouts/Header.vue'
// eslint-disable-next-line no-unused-vars -- dùng trong <template lang="pug">, vue-eslint-parser không phân tích được usage trong pug nên báo false positive
import Footer from '@/pages/_layouts/Footer.vue'
// eslint-disable-next-line no-unused-vars -- dùng trong <template lang="pug">, vue-eslint-parser không phân tích được usage trong pug nên báo false positive
import Main from '@/pages/_layouts/Main.vue'

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

// eslint-disable-next-line no-unused-vars -- dùng trong <template lang="pug">, vue-eslint-parser không phân tích được usage trong pug nên báo false positive
function getRouterName(path) {
    const _find = routers.find(r => r.to === path)
    return _find ? _find.text : 'Home'
}
</script>

<template lang="pug">
.body-container 
    Header
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
                                        li.dropdown-item(v-for="r in routers" :key="r.name" :class="{ active: r.to === $route.path }")
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
