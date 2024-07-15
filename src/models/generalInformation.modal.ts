/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import type { modelItem } from '@/types/model.type.ts'
/* import { formatDateToInput } from '@/utilities/index' */

const _mesRequired = 'Vui lòng nhập'
const _mesNumber = 'Vui lòng nhập vào số'

const MODEL: modelItem[] = [
    {
        name: '_id',
        label: 'ID',
        type: 'hidden',
        placeholder: 'Vui lòng nhập Vị trí mong muốn',
        valid: yup => yup.string().nullable().default(null),
        default: null,
    },
    {
        name: 'positionDesired',
        label: 'Vị trí mong muốn',
        type: 'text',
        placeholder: 'Vui lòng nhập Vị trí mong muốn',
        valid: yup => yup.string().max(50).trim().required(),
        default: '',
    },
    {
        name: 'career',
        label: 'Ngành nghề',
        type: 'text',
        placeholder: 'Vui lòng nhập Ngành nghề',
        valid: yup => yup.string().max(50).trim().required(),
        default: '',
    },
    {
        name: 'levelCurrent',
        label: 'Cấp bậc hiện tại',
        type: 'text',
        placeholder: 'Vui lòng nhập Cấp bậc hiện tại',
        valid: yup => yup.string().max(50).trim().required(),
        col: 'col-md-6',
        default: '',
    },
    {
        name: 'levelDesired',
        label: 'Cấp bậc mong muốn',
        type: 'text',
        placeholder: 'Vui lòng nhập Cấp bậc mong muốn',
        valid: yup => yup.string().max(50).trim().required(),
        col: 'col-md-6',
        default: '',
    },
    {
        name: 'education',
        label: 'Trình độ',
        type: 'select',
        options: [
            { value: 'intermediate', text: 'Trung cấp' },
            { value: 'college', text: 'Cao đẳng' },
            { value: 'university', text: 'Đại học' },
        ],
        placeholder: 'Vui lòng nhập Trình độ',
        valid: yup => yup.string().trim().max(50).required(),
        col: 'col-md-6',
        default: '',
    },
    {
        name: 'yearsOfExperience',
        label: 'Số năm kinh nghiệm',
        type: 'number',
        placeholder: 'Vui lòng nhập Số năm kinh nghiệm',
        valid: yup => yup.number().required(),
        col: 'col-md-6',
        default: 0,
    },
    {
        name: 'salaryDesired',
        label: 'Mức lương mong muốn',
        type: 'currency',
        placeholder: 'Vui lòng nhập Mức lương mong muốn',
        valid: yup => yup.string().required(),
        default: 0,
    },
]

export default MODEL
