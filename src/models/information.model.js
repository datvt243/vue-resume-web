/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { phoneRegex } from '@/config/regex.config'

const _mesRequired = 'Vui lòng nhập'

const MODEL_INFORMATION = [
    {
        name: 'firstName',
        label: 'Họ',
        type: 'text',
        placeholder: 'Vui lòng nhập Họ',
        valid: (yup) => yup.string().min(0).max(10, 'Tối đa 10 ký tự').required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'lastName',
        label: 'Tên',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên',
        valid: (yup) => yup.string().min(0).max(30, 'Tối đa 30 ký tự').required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'gender',
        label: 'Giới tính',
        type: 'select',
        options: [
            { value: 0, text: 'Nữ' },
            { value: 1, text: 'Nam' },
        ],
        valid: (yup) => yup.string().required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'marital',
        label: 'Tình trạng hôn nhân',
        type: 'select',
        options: [
            { value: 0, text: 'Độc thân' },
            { value: 1, text: 'Đã kết hôn' },
        ],
        valid: (yup) => yup.string().required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'birthday',
        label: 'Ngày sinh',
        type: 'date',
        valid: (yup) => yup.string().required(_mesRequired),
        col: 'col-md-12',
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        type: 'text',
        valid: (yup) => yup.string().required(_mesRequired),
        col: 'col-md-12',
    },
    {
        name: 'phone',
        label: 'Số điện thoại',
        type: 'text',
        valid: (yup) =>
            yup
                .string()
                .matches(phoneRegex, {
                    excludeEmptyString: true,
                    message: 'Số điện thoại không đúng định dạng. Bắt đầu bằng 84 hoặc 0, bao gồm 11 số',
                })
                .required(_mesRequired),
        col: 'col-md-12',
    },
    {
        name: 'introduction',
        label: 'Giới thiệu bản thân',
        type: 'textarea',
        valid: (yup) => yup.string().required(_mesRequired),
        col: 'col-md-12',
    },
]

export default MODEL_INFORMATION
