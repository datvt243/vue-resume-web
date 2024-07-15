import { h } from 'vue'

const TableRow = (props, { slots, attrs }) => {
    return h(props.tag === 'th' ? 'th' : 'td', {}, slots?.default && slots.default())
}

TableRow.props = {
    tag: { type: String, default: 'td' },
}
TableRow.slots = ['default']

export default TableRow
