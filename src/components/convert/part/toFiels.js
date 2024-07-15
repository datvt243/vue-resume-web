/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

const ConvertToFiles = props => {
    const { modelValue: value } = props
    return h('span', value)
}

ConvertToFiles.slots = ['default']
ConvertToFiles.props = ['modelValue']

export default ConvertToFiles
