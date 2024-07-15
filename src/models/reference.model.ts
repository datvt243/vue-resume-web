/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { modelItem } from '@/types/model.type.ts'
import { phoneRegex } from '@/config/regex.config'

const _mesRequired = 'Vui lòng nhập'

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
        name: 'fullName',
        label: 'Họ tên người tham khảo',
        type: 'text',
        placeholder: 'Vui lòng nhập Họ tên người tham khảo',
        valid: yup => yup.string().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
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
        label: 'Vị trí công việc',
        type: 'text',
        placeholder: 'Vui lòng nhập Vị trí công việc',
        valid: yup => yup.string().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: 'text',
        valid: yup =>
            yup
                .string()
                .matches(phoneRegex, {
                    excludeEmptyString: true,
                    message: 'Số điện thoại không đúng định dạng. Bắt đầu bằng 84 hoặc 0, bao gồm 11 số',
                })
                .required(_mesRequired),
        col: 'col-md-12',
        default: '',
    },
]

export default MODEL
