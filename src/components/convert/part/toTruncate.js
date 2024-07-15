/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

const ConvertToTruncate = (props) => {
    const { modelValue: value } = props

    const _newVal = value.length(25)
    return h('span', _newVal)
}

ConvertToTruncate.slots = ['default']
ConvertToTruncate.props = ['modelValue']

export default ConvertToTruncate
