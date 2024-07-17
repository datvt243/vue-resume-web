<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { computed } from 'vue'
import { authStore } from '@/stores/auth'
import { candidateStore } from '@/stores/candidate'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = authStore()
const candidate = candidateStore()

const _user = store.getUser

const API_getme = _user?.email ? `https://nodejs-resume-api.onrender.com/api/me/${_user.email}` : '#'

const authRouter = [
    { text: 'Đăng nhập', to: '/login' },
    { text: '/', to: '' },
    { text: 'Đăng ký', to: '/register' },
]

const mesUser = computed(() => {
    const user = store.getUser
    const fullName = (user => {
        const { firstName = '', lastName = '', email = '' } = user
        const _name = `${firstName} ${lastName} ${email}`.trim()
        return _name || 'User'
    })(user || {})

    return `<small class="opacity-60">Xin chào,</small> ${fullName}`
})

function _handelLogout() {
    store.logOut({ router })
    candidate.clean()
}
</script>

<template lang="pug">
header.py-2.border-bottom.bg-body-tertiary
    .container
        nav.navbar.navbar-expand-lg
            a.navbar-brand(href="#") Resume API
            template(v-if="!store.isAuthenticated")
                ul.navbar-nav.ms-auto.mb-2.mb-lg-0
                    li.nav-item(v-for='(r, i) in authRouter' :key="`router_${i}`")
                        template(v-if="r.to")
                            RouterLink.nav-link(:to="r.to" :class="{ active: r.to === $route.fullPath}") {{ r.text }}
                        span.nav-link(v-else) /
            .ms-auto(v-else)
                Dropdown(:text="mesUser" :style="'outline-light'" split is-sm)
                    li.dropdown-item
                        a.dropdown-link(href="#" @click="_handelLogout") Logout
                    li.dropdown-item
                        a.dropdown-link(:href="API_getme" target="_blank") View API
</template>
