/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const authStore = defineStore('auth', () => {
    const _user = reactive(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {})
    const _token = ref(localStorage.getItem('token') || '')

    const getToken = computed(() => _token.value)
    const getUser = computed(() => _user)
    const isAuthenticated = computed(() => !!_token.value)

    function logOut(opt = {}) {
        // remove localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')

        // reset [user, token, isAuthenticated]
        Object.assign(_user, {})
        _token.value = ''

        // direct router
        opt?.router?.push('/login')
    }

    function setUser(val) {
        Object.assign(_user, val)
        localStorage.setItem('user', JSON.stringify(val))
    }

    function setToken(val) {
        _token.value = val
        localStorage.setItem('token', val)
    }
    function clearUser() {
        Object.assign(_user, {})
    }

    return {
        logOut,
        isAuthenticated,
        setUser,
        setToken,
        clearUser,
        getToken,
        getUser,
    }
})
