/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'
import ConvertToText from './part/toText'
import ConvertToDate from './part/toDate'
import ConvertToBoolean from './part/toBoolean'
import ConvertToTruncate from './part/toTruncate'
import ConvertToFiles from './part/toFiels'

const Convert = (props, { slots }) => {
    const { modelValue: value, to } = props

    function _render(to) {
        let _res = ''
        switch (to) {
            case 'date':
                _res = h(ConvertToDate, { modelValue: value })
                break
            case 'boolean':
                _res = h(ConvertToBoolean, { modelValue: value })
                break
            case 'truncate':
                _res = h(ConvertToTruncate, { modelValue: value })
                break
            case 'file':
                _res = h(ConvertToFiles, { modelValue: value })
                break
            default:
                _res = h(ConvertToText, { modelValue: value })
        }
        return _res
    }

    return h('span', { 'data-type': to }, _render(to))
}

Convert.slots = ['default']
Convert.props = {
    modelValue: { type: [String, Number, Boolean, Array, Object], default: '' },
    to: { type: String, default: 'text' },
}

export default Convert
