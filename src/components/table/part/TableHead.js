import { h } from 'vue'

const TableHead = (props, { slots }) => {
    return h('thead', {}, slots?.default && slots.default())
}

TableHead.props = {}
TableHead.slots = ['default']

export default TableHead
