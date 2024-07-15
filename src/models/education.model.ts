/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { modelItem } from '@/types/model.type.ts'
import { formatDateToInput } from '@/utilities/index'

const _mesRequired = 'Vui lòng nhập'
const _mesNumber = 'Vui lòng nhập vào số'

const MODEL: modelItem[] = [
    {
        name: '_id',
        label: 'ID',
        type: 'hidden',
        placeholder: 'Vui lòng nhập Tên trường',
        valid: yup => yup.string().nullable().default(null),
        col: 'col-md-12',
        default: null,
    },
    {
        name: 'school',
        label: 'Tên trường',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên trường',
        valid: yup => yup.string().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'major',
        label: 'Chuyên ngành',
        type: 'text',
        placeholder: 'Vui lòng nhập Chuyên nhành',
        valid: yup => yup.string().max(50, 'Tối đa 50 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'startDate',
        label: 'Ngày bắt đầu',
        type: 'date',
        placeholder: 'Vui lòng nhập Ngày bắt đầu',
        valid: yup => yup.date().required(_mesRequired),
        col: 'col-md-6',
        convertTo: 'date',
        default: formatDateToInput(+new Date()),
    },
    {
        name: 'endDate',
        label: 'Ngày Kết thúc',
        type: 'date',
        placeholder: 'Vui lòng nhập Ngày Kết thúc',
        valid: yup => yup.date().required(_mesRequired).min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
        col: 'col-md-6',
        convertTo: 'date',
        default: formatDateToInput(+new Date()),
    },
    {
        name: 'isCurrent',
        label: 'Đang học tại đây',
        type: 'checkbox',
        placeholder: '',
        default: false,
        valid: yup => yup.boolean(),
        col: 'col-md-12',
        cellClass: 'text-center',
        convertTo: 'boolean',
        checkedValue: false,
    },
    {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        valid: yup => yup.string().required(_mesRequired),
        col: 'col-md-12',
        convertTo: 'truncate',
        default: '',
    },
]

export default MODEL
