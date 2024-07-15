/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
const ConvertToBoolean = (props) => {
    const { modelValue: value } = props

    return h(
        'span',
        { class: value ? 'text-success' : 'text-danger' },
        value ? h(FontAwesomeIcon, { icon: 'fa-solid fa-check' }) : h(FontAwesomeIcon, { icon: 'fa-solid fa-xmark' }),
    )
}

ConvertToBoolean.components = ['FontAwesomeIcon']
ConvertToBoolean.slots = ['default']
ConvertToBoolean.props = {
    modelValue: { type: Boolean, default: false },
}

export default ConvertToBoolean
