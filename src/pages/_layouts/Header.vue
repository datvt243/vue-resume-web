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
import { handleBase } from '@/services/base'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const store = authStore()
const candidate = candidateStore()

const _user = store.getUser
const _token = store.getToken

const HOST = window.location.host === 'localhost' ? 'http://localhost:3001' : 'https://nodejs-resume-api.onrender.com'

const API_GET_ME = _user?.email ? `${HOST}/api/me/${_user.email}` : '#'
const API_DOWNLOAD_PDF = `${HOST}/api/v1/download-pdf?token=${_token}`

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
async function _download() {
    const opt = { method: 'get', url: `download-pdf`, params: { token: _token } }

    await handleBase(opt, {}, res => {
        console.log(res)
    })
}
</script>

<template lang="pug">
header.py-2.border-bottom.bg-body-tertiary
    template(v-if="!store.isAuthenticated")
        Navbar.flex-grow-1
            .ms-auto.border-lg-t
                ul.navbar-nav.ms-auto.mb-2.mb-lg-0
                    li.nav-item(v-for='(r, i) in authRouter' :key="`router_${i}`")
                        template(v-if="r.to")
                            RouterLink.nav-link(:to="r.to" :class="{ active: r.to === $route.fullPath}") {{ r.text }}
                        span.nav-link.d-none.d-lg-block(v-else) /
    .container(v-else)
        nav.navbar.navbar-expand-lg
            a.navbar-brand(href="#") Resume API
            .ms-auto
                .d-flex.align-items-center
                    div.clearfix.pe-4
                        a.btn.btn-sm.btn-outline-success(:href="API_DOWNLOAD_PDF" target="_blank") Download CV 
                    Dropdown(:text="mesUser" :style="'outline-light'" split is-sm)
                        li.dropdown-item
                            a.dropdown-link(:href="API_GET_ME" target="_blank")
                                span.pe-2.text-info
                                    FontAwesomeIcon(icon="fa fa-code")
                                | View API
                        li.dropdown-divider
                        li.dropdown-item
                            span.d-block.pointer( @click="_handelLogout") 
                                span.pe-2.text-danger
                                    FontAwesomeIcon(icon="fa fa-arrow-right-from-bracket")
                                | Logout
                    
                   
</template>
