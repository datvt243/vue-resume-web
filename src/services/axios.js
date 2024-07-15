/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

// Import axios
import axios from 'axios'

const TOKEN = localStorage?.getItem('token') || ''
const API_URL = 'https://nodejs-resume-api.onrender.com/'

//

// Tạo một instance của axios với cấu hình tùy chỉnh
const instanceAxios = axios.create({
    baseURL: API_URL,
    //timeout: 1000, // Thời gian chờ tối đa cho mỗi request
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    },
})

export const _axios = props => {
    const { url, method, params, data, customURL = null } = props

    return new Promise((resolve, reject) => {
        instanceAxios({
            url: customURL ? customURL : url,
            method,
            params,
            data,
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(err => {
                reject(err.response?.data)
            })
    })
}
