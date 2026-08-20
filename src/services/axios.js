/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import axios from 'axios'
import { API, subURL } from '@/config/api.config'
import { authStore } from '@/stores/auth'

const instanceAxios = axios.create({
    baseURL: API,
    // timeout: 1000,
    /* headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    }, */
})

/**
 * silent refresh: khi access token hết hạn (401), thử đổi lấy token mới
 * bằng refresh token trước khi force logout.
 */
let _refreshPromise = null

instanceAxios.interceptors.response.use(
    res => res,
    async err => {
        const originalRequest = err.config
        const refreshToken = localStorage?.getItem('tokenRefresh')

        if (err.response?.status === 401 && refreshToken && !originalRequest?._retry) {
            originalRequest._retry = true
            try {
                /**
                 * dedupe: nhiều request 401 cùng lúc chỉ gọi auth/refresh một
                 * lần, chia sẻ chung 1 promise thay vì mỗi request tự refresh.
                 */
                if (!_refreshPromise) {
                    _refreshPromise = axios.post(`${API}${subURL}auth/refresh`, { refreshToken }).finally(() => {
                        _refreshPromise = null
                    })
                }
                const res = await _refreshPromise
                const { token } = res.data
                authStore().setToken(token)
                originalRequest.headers.Authorization = `Bearer ${token}`
                return instanceAxios(originalRequest)
            } catch (refreshErr) {
                authStore().logOut()
                return Promise.reject(refreshErr)
            }
        }

        return Promise.reject(err)
    },
)

export const _axios = async props => {
    const { url, method, params, data, customURL = null, token = null } = props
    return new Promise((resolve, reject) => {
        instanceAxios({
            url: customURL ? customURL : url,
            method,
            params,
            data,
            headers: {
                Authorization: `Bearer ${token || localStorage?.getItem('token') || ''}`,
                'Content-Type': 'application/json',
            },
            baseURL: API,
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.response?.data ?? { message: 'Lỗi kết nối, vui lòng thử lại', errors: {}, invalidToken: false })
            })
    })
}
