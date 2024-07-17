/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { modelItem } from '@/types/model.type.ts'
import { defaultId, defaultDateStartEnd, defaultDescription, defaultLink } from '@/types/model.type'
import { formatDateToInput } from '@/utilities/index'

const _mesRequired = 'Vui lòng nhập'
const _mesNumber = 'Vui lòng nhập vào số'

const MODEL: modelItem[] = [
    defaultId,
    {
        name: 'name',
        label: 'Tên dự án',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên dự án',
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
        name: 'technology',
        label: 'Công nghệ sử dụng',
        type: 'text',
        placeholder: 'Vui lòng nhập Công nghệ sử dụng',
        valid: yup => yup.string().required(_mesRequired),
        default: '',
    },

    ...defaultDateStartEnd(),
    {
        name: 'isWorking',
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
    defaultLink({ name: 'link', label: 'Link' }),
    /* {
        name: 'images',
        label: 'Hình ảnh',
        valid: yup => yup.string().required(_mesRequired),
        type: 'file',
        col: 'col-md-12',
        default: '',
    }, */
    defaultDescription({ name: 'description', label: 'Mô tả' }),
]

export default MODEL
