<script>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'

export default {
    props: {
        tag: { type: String, default: 'h4' },
        text: { type: String, default: 'Heading' },
    },
    setup(props, { slots }) {
        return () =>
            h(
                'div',
                {
                    class: 'heading d-flex align-item-center justify-content-between pb-2 mb-4 border-bottom text-uppercase',
                },
                [
                    h('p', { class: [props.tag, ' m-0'] }, props.text),
                    h('div', { class: 'ms-auto' }, slots?.default && slots.default()),
                ],
            )
    },
}
</script>
