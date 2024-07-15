import { h } from 'vue'

const Table = (props, { slots, attrs }) => {
    return h(
        'table',
        {
            class: ['table table-hover', { 'table-hover': attrs.tableHover }],
        },
        slots?.default && slots.default(),
    )
}

Table.props = {}
Table.slots = ['default']

export default Table
