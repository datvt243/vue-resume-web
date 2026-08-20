/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { _axios } from '@/services/axios'
import { authStore } from '@/stores/auth'
import { candidateStore } from '@/stores/candidate'
import { toValue } from 'vue'
import { subURL } from '@/config/api.config'

export const handleLogin = async (values, props) => {
    const { email, password } = values
    const { loading = null, toast = null, router = null } = props

    /**
     * spinner loading
     */
    toValue(loading)?.show()

    /**
     * fetch data
     *
     */
    try {
        const loginRes = await _axios({
            method: 'post',
            url: `${subURL}auth/login`,
            data: {
                email: email.trim(),
                password: password.trim(),
            },
        })

        toast?.({
            message: loginRes.message,
            bg: 'success',
        })

        const { user, token, tokenRefresh } = loginRes.data

        const candidateRes = await _axios({ method: 'get', url: `${subURL}candidate/${email.trim()}`, token })
        candidateStore().setCandidate({ ...candidateRes.data })

        const store = authStore()
        store.setToken(token)
        tokenRefresh && store.setRefreshToken(tokenRefresh)
        store.setUser({ ...user })
        router?.push('/dashboard/information')
    } catch (err) {
        toast?.({
            message: 'Đăng nhập thất bại',
            bg: 'danger',
        })
    } finally {
        /**
         * spinner hide
         */
        toValue(loading)?.hide()
    }
}

export const handleRegister = async (values, props) => {
    const { firstName, lastName, email, password, repassword } = values
    const { loading = null, toast = null, router = null } = props

    /**
     * spinner loading
     */
    toValue(loading)?.show()

    try {
        const res = await _axios({
            method: 'post',
            url: `${subURL}auth/register`,
            data: {
                firstName,
                lastName,
                email,
                password,
                repassword,
            },
        })

        toast?.({
            message: res.message,
            bg: 'success',
        })

        router?.push('/login')
    } catch (err) {
        const { message = '' } = err
        toast?.({
            message: message + '',
            bg: 'danger',
        })
    } finally {
        /**
         * spinner hide
         */
        toValue(loading)?.hide()
    }
}
