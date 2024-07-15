/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'
import { formatDate } from '@/utilities/index.ts'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const ConvertToDate = (props) => {
    const { modelValue: value } = props
    return h('span', [
        h('span', { class: 'pe-2 opacity-50' }, h(FontAwesomeIcon, { icon: 'fa-solid fa-calendar' })),
        h('span', { class: '' }, formatDate(value)),
    ])
}

ConvertToDate.slots = ['default']
ConvertToDate.props = {
    modelValue: { type: [Number, null], default: null },
}

export default ConvertToDate
