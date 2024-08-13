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
        placeholder: 'Vui lòng nhập ID',
        valid: yup => yup.mixed().nullable().default(null),
        col: 'col-md-12',
        default: null,
    },
    {
        name: 'company',
        label: 'Tên công ty',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên công ty',
        valid: yup => yup.string().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'position',
        label: 'Vị trí',
        type: 'text',
        placeholder: 'Vui lòng nhập Vị trí',
        valid: yup => yup.string().max(50, 'Tối đa 50 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'startDate',
        label: 'Ngày bắt đầu',
        type: 'date',
        placeholder: 'Vui lòng nhập Ngày bắt đầu',
        valid: yup => yup.number().required(_mesRequired),
        col: 'col-md-6',
        convertTo: 'date',
        default: +new Date(),
        monthPicker: true,
    },
    {
        name: 'endDate',
        label: 'Ngày Kết thúc',
        type: 'date',
        placeholder: 'Vui lòng nhập Ngày Kết thúc',
        valid: yup => yup.number().nullable(),
        col: 'col-md-6',
        convertTo: 'date',
        default: +new Date(),
        monthPicker: true,
    },
    {
        name: 'isCurrent',
        label: 'Đang làm việc tại đây',
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
        type: 'ckediter',
        valid: yup => yup.string().required(_mesRequired),
        col: 'col-md-12',
        convertTo: 'truncate',
        default: '',
    },
]

export default MODEL
