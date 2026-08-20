/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { candidateStore } from '@/stores/candidate'

export const authStore = defineStore('auth', () => {
    const _user = reactive(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {})
    const _token = ref(localStorage.getItem('token') || '')
    const _refreshToken = ref(localStorage.getItem('tokenRefresh') || '')

    const getToken = computed(() => _token.value)
    const getRefreshToken = computed(() => _refreshToken.value)
    const getUser = computed(() => _user)
    const isAuthenticated = computed(() => !!_token.value)

    function logOut(opt = {}) {
        // remove localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('tokenRefresh')

        // reset [user, token, isAuthenticated]
        Object.keys(_user).forEach(key => delete _user[key])
        _token.value = ''
        _refreshToken.value = ''
        candidateStore().clean()

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
    function setRefreshToken(val) {
        _refreshToken.value = val
        localStorage.setItem('tokenRefresh', val)
    }
    function clearUser() {
        Object.keys(_user).forEach(key => delete _user[key])
    }

    return {
        logOut,
        isAuthenticated,
        setUser,
        setToken,
        setRefreshToken,
        clearUser,
        getToken,
        getRefreshToken,
        getUser,
    }
})
