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

// eslint-disable-next-line no-unused-vars -- dùng trong <template lang="pug">, vue-eslint-parser không phân tích được usage trong pug nên báo false positive
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
</script>

<template lang="pug">
.body-container
    Header
    Main
        .container
            .dashboard-layout.d-flex.gap-4.align-items-start
                aside.dashboard-sidebar
                    .dashboard-sidebar-title.d-flex.align-items-center
                        FontAwesomeIcon.me-2(icon="fa-solid fa-gauge")
                        | Dashboard
                    nav.nav.flex-column.dashboard-sidebar-nav
                        RouterLink.dashboard-sidebar-link(v-for="r in routers" :key="r.name" :to="r.to" :class="{ active: r.to === $route.path }") {{ r.text }}
                .dashboard-content.flex-grow-1
                    #reload
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

.dashboard-layout {
    .dashboard-sidebar {
        width: 220px;
        flex-shrink: 0;
        background-color: var(--bs-tertiary-bg);
        border: 1px solid var(--bs-border-color-translucent);
        border-radius: 0.75rem;
        padding: 1rem;
        position: sticky;
        top: 1rem;
    }

    .dashboard-sidebar-title {
        font-weight: 600;
        padding: 0 0.75rem;
        margin-bottom: 0.75rem;
    }

    .dashboard-sidebar-link {
        display: block;
        padding: 0.5rem 0.75rem;
        border-radius: 0.5rem;
        color: var(--bs-body-color);
        text-decoration: none;

        &:hover {
            background-color: var(--bs-border-color-translucent);
        }

        &.active {
            background-color: var(--bs-green);
            color: #fff;
            font-weight: 600;
        }
    }

    .dashboard-content {
        min-width: 0;
    }
}

@media (max-width: 767.98px) {
    .dashboard-layout {
        flex-direction: column;

        .dashboard-sidebar {
            width: 100%;
            position: static;
        }
    }
}
</style>
