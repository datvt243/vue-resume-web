/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

const Navbar = (props, { slots }) => {
    return h(
        'nav',
        {
            class: ['navbar', props?.class || ''].join(' '),
        },
        slots?.default && slots?.default(),
    )
}

Navbar.slots = ['default']
Navbar.props = {
    class: { type: String, default: 'navbar-expand-lg' },
}

export default Navbar
