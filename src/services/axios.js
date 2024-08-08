/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import axios from 'axios'
import { API } from '@/config/api.config'

const TOKEN = localStorage?.getItem('token') || ''

const instanceAxios = axios.create({
    baseURL: API,
    // timeout: 1000,
    /* headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    }, */
})

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
                reject(err.response?.data)
            })
    })
}
