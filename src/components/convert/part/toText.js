/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

const ConvertToText = (props) => {
    const { modelValue: value } = props
    return h('span', value)
}

ConvertToText.slots = ['default']
ConvertToText.props = ['modelValue']

export default ConvertToText
