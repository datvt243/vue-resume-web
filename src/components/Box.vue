<script>
import { h } from 'vue'
export default {
    props: {
        class: { type: String, default: '' },
    },
    setup(props, { slots }) {
        return () => h('div', { class: 'clearfix', class: props.class }, slots?.default && slots?.default())
    },
}
</script>
