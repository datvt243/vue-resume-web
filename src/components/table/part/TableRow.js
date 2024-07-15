import { h } from 'vue'

const TableRow = (props, { slots, attrs }) => {
    return h('tr', {}, slots?.default && slots.default())
}

TableRow.props = ['modelValue']
TableRow.slots = ['default']

export default TableRow
