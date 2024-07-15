/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { _axios } from '@/services/axios'
import { authStore } from '@/stores/auth'

const subURL = 'api/v1/'

export const handleBase = async (axiosOptions, props, callback) => {
    /**
     *
     */
    await handleFrameFetch(axiosOptions, props, callback, async (axiosOptions, toast, callback) => {
        const { method, url, data = null, params = null, customURL = null } = axiosOptions

        const _props = (() => {
            const _result = {
                method,
                url: customURL ? customURL : `${subURL}${url}`,
            }
            data && (_result.data = data)
            params && (_result.params = params)
            return _result
        })()

        const __helper = _helper({ toast })
        await _axios(_props)
            .then(res => {
                callback?.(res)
                __helper.success(res)
            })
            .catch(err => {
                __helper.error(err)
            })
    })
}

const handleFrameFetch = async (axiosOptions, props, callback, action) => {
    const { loading = null, toast = null } = props

    /**
     * spinner loading
     */
    loading?.show()

    /**
     * fetch data
     *
     */
    try {
        await action?.(axiosOptions, toast, callback)
    } catch (err) {
        throw new Error(`fn handleBase, ${err}`)
    }

    /**
     * spinner hide
     */
    loading?.hide()
}

const _helper = props => {
    const { toast } = props
    return {
        success: res => {
            const { message = '' } = res
            toast?.({
                message: message,
                bg: 'success',
            })
        },
        error: err => {
            const { message = '', errors = {}, invalidToken = false } = err

            /**
             * báo lỗi
             */
            const _message = []

            /**
             *
             */
            message && _message.push(message)

            /**
             *
             */
            if (errors && Object.keys(errors).length) {
                for (const [key, mess] of Object.entries(errors)) {
                    _message.push(`<br />- ${mess} `)
                }
            }

            /**
             * show toast
             */
            toast &&
                toast?.({
                    message: _message.join('\n') + '',
                    bg: 'danger',
                })

            /**
             * lỗi trả về là invalidToken thì logout
             */
            if (invalidToken) {
                const store = authStore()
                store?.logOut()
            }
        },
    }
}

export const handleBaseDelete = (opts, props, callback) => {
    const { collection, id } = opts
}
