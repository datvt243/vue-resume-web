/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { _axios } from '@/services/axios'
import { authStore } from '@/stores/auth'
import { candidateStore } from '@/stores/candidate'
import { toValue } from 'vue'

const subURL = 'api/v1/'

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
        await _axios({
            method: 'get',
            url: `${subURL}auth/login`,
            params: {
                email: email.trim(),
                password: password.trim(),
            },
        })
            .then(async res => {
                const { message } = res

                toast?.({
                    message: message,
                    bg: 'success',
                })

                const { user, token, tokenRefresh } = res.data
                const store = authStore()
                store.setToken(token)
                store.setUser({ ...user })

                try {
                    await (async () => {
                        const opt = { method: 'get', url: `candidate/${email.trim()}` }
                        await _axios(opt)
                            .then(res => {
                                const { data } = res
                                const candidate = candidateStore()
                                candidate.setCandidate({ ...data })
                            })
                            .catch(err => console.log(err))
                    })()
                } catch (err) {
                    console.log(err)
                }

                router?.push('/dashboard/information')
            })
            .catch(err => {
                const { message } = err
                toast?.({
                    message: message + '',
                    bg: 'danger',
                })
            })
    } catch (err) {
        throw new Error(err)
    }

    /**
     * spinner hide
     */
    toValue(loading)?.hide()
}

export const handleRegister = async (values, props) => {
    const { firstName, lastName, email, password, repassword } = values
    const { loading = null, toast = null, router = null } = props

    /**
     * spinner loading
     */
    loading.show()

    await _axios({
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
        .then(res => {
            const { message } = res
            toast?.({
                message: message,
                bg: 'success',
            })

            router?.push('/login')
        })
        .catch(err => {
            const { message } = err
            toast?.({
                message: message + '',
                bg: 'danger',
            })
        })

    /**
     * spinner hide
     */
    loading?.hide()
}

export const handleLogout = (opt = {}) => {
    const store = authStore()
    store.logOut()
    opt?.router?.push('/login')
}
