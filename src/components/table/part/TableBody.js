import { h } from 'vue'

const TableBody = (props, { slots }) => {
    return h('tbody', {}, slots?.default && slots.default())
}

TableBody.props = {}
TableBody.slots = ['default']

export default TableBody
