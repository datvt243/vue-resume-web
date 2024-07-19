<script>
import { h, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
    props: {
        text: { type: String, default: '' },
        type: { type: String, default: 'success' },
        icon: { type: String, default: '' },
        iconPosition: { type: String, default: 'start' },
        size: { type: String, default: '' },
    },
    setup(props) {
        const getContent = computed(() => {
            const { icon, text = '', iconPosition } = props
            const _result = [text]
            if (icon) {
                const _icon = h(FontAwesomeIcon, { icon: icon })
                iconPosition === 'start' ? _result.unshift(_icon) : _result.push(_icon)
            }
            return _result
        })
        const getClassName = computed(() => {
            const { size, type = 'success' } = props
            let classDefault = 'btn'
            type && (classDefault += ` btn-${type}`)
            size && (classDefault += ` btn-${size}`)

            return classDefault
        })

        return () =>
            h(
                'button',
                {
                    type: 'button',
                    class: getClassName.value,
                },
                getContent.value,
            )
    },
}
</script>
