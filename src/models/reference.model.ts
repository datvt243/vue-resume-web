/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { modelItem } from '@/types/model.type.ts'
import { defaultId, defaultPhone } from '@/types/model.type'

const _mesRequired = 'Vui lòng nhập'

const MODEL: modelItem[] = [
    defaultId,
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
    defaultPhone({ name: 'phone', label: 'Số điện thoại' }),
]

export default MODEL
