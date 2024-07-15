<script>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { h } from 'vue'
export default {
    props: {},
    setup(props, { slots }) {
        return () => h('main', { class: 'main-container py-4' }, slots?.default && slots.default())
    },
}
</script>
