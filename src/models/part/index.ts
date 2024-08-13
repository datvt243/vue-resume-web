import type { modelItem } from '@/types/model.type.ts'
const _mesRequired = 'Vui lòng nhập'
const _mesNumber = 'Vui lòng nhập vào số'

export const startDate: modelItem = {
    name: 'startDate',
    label: 'Ngày bắt đầu',
    type: 'date',
    placeholder: 'Vui lòng nhập Ngày bắt đầu',
    valid: yup => yup.number().required(_mesRequired),
    col: 'col-md-6',
    convertTo: 'date',
    default: +new Date(),
    monthPicker: true,
}

export const endDate: modelItem = {
    name: 'endDate',
    label: 'Ngày Kết thúc',
    type: 'date',
    placeholder: 'Vui lòng nhập Ngày Kết thúc',
    valid: yup => yup.number().nullable(),
    col: 'col-md-6',
    convertTo: 'date',
    default: +new Date(),
    monthPicker: true,
}
