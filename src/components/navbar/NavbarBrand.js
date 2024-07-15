/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

const NavbarBrand = (props, { slots }) => {
    return h(
        'a',
        {
            class: 'navbar-brand',
            href: props?.href || '#',
        },
        props.brand || 'Header Title',
    )
}

NavbarBrand.slots = ['default']
NavbarBrand.props = {
    class: { type: String, default: 'navbar-brand' },
    href: { type: String, default: '#' },
}

export default NavbarBrand
