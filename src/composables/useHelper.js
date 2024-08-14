/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { inject, toValue } from 'vue'

export const useHelper = () => {
    const refSpinner = inject('spinner')
    const refToast = inject('toast')

    return {
        loading: toValue(refSpinner),
        toast: refToast,
    }
}
