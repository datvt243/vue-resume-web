import { h } from 'vue'

const TableBody = (props, { slots, attrs }) => {
    return h('tbody', {}, slots?.default && slots.default())
}

TableBody.props = {}
TableBody.slots = ['default']

export default TableBody
