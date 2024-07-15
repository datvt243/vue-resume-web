/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { createMemoryHistory, createRouter } from 'vue-router'
import { authStore } from '@/stores/auth'

const routes = [
    { path: '/', component: () => import('@/pages/home/PageHome.vue'), meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: () => import('@/pages/auth/PageLogin.vue') },
    { path: '/register', name: 'register', component: () => import('@/pages/auth/PageRegister.vue') },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/PageDashboard.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'information',
                name: 'information',
                component: () => import('@/pages/dashboard/PageInformation.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'general-information',
                name: 'generalInformation',
                component: () => import('@/pages/dashboard/PageGeneralInformation.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'education',
                name: 'education',
                component: () => import('@/pages/dashboard/PageEducation.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'experience',
                name: 'experience',
                component: () => import('@/pages/dashboard/PageExperience.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'project',
                name: 'project',
                component: () => import('@/pages/dashboard/PageProject.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'award',
                name: 'award',
                component: () => import('@/pages/dashboard/PageAward.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'certificate',
                name: 'certificate',
                component: () => import('@/pages/dashboard/PageCertificate.vue'),
                meta: { requiresAuth: true },
            },
            {
                path: 'reference',
                name: 'reference',
                component: () => import('@/pages/dashboard/PageReference.vue'),
                meta: { requiresAuth: true },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/pages/notFound/NotFound.vue'),
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

router?.beforeEach((to, from, next) => {
    const { path } = to
    if (path !== '/') localStorage.setItem('current-page', path)

    if (to.matched.some(record => record.meta.requiresAuth)) {
        const store = authStore()
        const isAuthenticated = store.isAuthenticated

        if (!isAuthenticated) {
            next({ name: 'login' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
