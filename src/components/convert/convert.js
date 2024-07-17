/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'
import { ConvertToText, ConvertToDate, ConvertToBoolean, ConvertToTruncate, ConvertToFiles } from '@/components/convert/part'

const objConvert = {
    date: value => h(ConvertToDate, { modelValue: value }),
    boolean: value => h(ConvertToBoolean, { modelValue: value }),
    truncate: value => h(ConvertToTruncate, { modelValue: value }),
    file: value => h(ConvertToFiles, { modelValue: value }),
    default: value => h(ConvertToText, { modelValue: value }),
}

const Convert = (props, { slots }) => {
    const { modelValue: value, to } = props
    return h('span', { 'data-type': to }, objConvert?.[to]?.(value) || objConvert['default']?.(value))
}

Convert.slots = ['default']
Convert.props = {
    modelValue: { type: [String, Number, Boolean, Array, Object], default: '' },
    to: { type: String, default: 'text' },
}

export default Convert
