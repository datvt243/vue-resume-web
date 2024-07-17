/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { formatDateToInput } from '@/utilities/index'
import { phoneRegex } from '@/config/regex.config'

type inputType =
    | 'text'
    | 'email'
    | 'number'
    | 'hidden'
    | 'password'
    | 'file'
    | 'date'
    | 'currency'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'ckediter'

interface Options {
    value: string | number | boolean
    text: string
}

const _mesRequired = 'Vui lòng nhập'

interface Part {
    name: string
    label: string
    col?: string
    placeholder?: string
}

export interface modelItem {
    // request
    name: string
    label: string
    type: inputType
    default: any
    // optional
    text?: string
    placeholder?: string
    valid?: (yup: any) => any
    col?: string
    convertTo?: string
    checkedValue?: boolean
    options?: Options[]
    cellClass?: string
}

export const defaultId: modelItem = {
    name: '_id',
    label: 'ID',
    type: 'hidden',
    placeholder: 'Vui lòng nhập',
    valid: yup => yup.string().nullable().default(null),
    col: 'col-md-12',
    default: null,
}

export const defaultDescription = function (props: Part): modelItem {
    return {
        name: props.name,
        label: props.label,
        type: 'ckediter',
        valid: yup => yup.string().trim().required(_mesRequired),
        col: props?.col || 'col-md-12',
        convertTo: 'truncate',
        default: '',
    }
}

export const defaultLink = function (props: Part): modelItem {
    return {
        name: props.name,
        label: props.label,
        type: 'text',
        valid: yup => yup.string().url().nullable(),
        col: props?.col || 'col-md-12',
        default: '',
    }
}

export const defaultDate = function (props: Part): modelItem {
    return {
        name: props.name,
        label: props.label,
        type: 'date',
        valid: yup => yup.string().required(_mesRequired),
        default: new Date('1990-01-01'),
        col: props?.col || 'col-md-12',
    }
}
export const defaultDateStartEnd = function (): modelItem[] {
    const _startLabel = 'Ngày bắt đầu',
        _endLabel = 'Ngày kết thúc'

    return [
        {
            name: 'startDate',
            label: _startLabel,
            type: 'date',
            placeholder: `Vui lòng nhập ${_startLabel}`,
            valid: yup => yup.date().required(_mesRequired),
            col: 'col-md-6',
            convertTo: 'date',
            default: formatDateToInput(+new Date()),
        },
        {
            name: 'endDate',
            label: _endLabel,
            type: 'date',
            placeholder: `Vui lòng nhập ${_endLabel}`,
            valid: yup => yup.date().required(_mesRequired).min(yup.ref('startDate'), `${_endLabel} phải sau ngày bắt đầu`),
            col: 'col-md-6',
            convertTo: 'date',
            default: formatDateToInput(+new Date()),
        },
    ]
}

export const defaultCheckoxBoolean = function (props: Part): modelItem {
    return {
        name: props.name,
        label: props.label,
        type: 'checkbox',
        placeholder: props?.placeholder || '',
        default: false,
        valid: yup => yup.boolean(),
        col: props?.col || 'col-md-12',
        cellClass: 'text-center',
        convertTo: 'boolean',
        checkedValue: false,
    }
}

export const defaultPhone = function (props: Part): modelItem {
    return {
        name: props.name,
        label: props.label,
        type: 'text',
        valid: yup =>
            yup
                .string()
                .matches(phoneRegex, {
                    excludeEmptyString: true,
                    message: 'Số điện thoại không đúng định dạng. Bắt đầu bằng 84 hoặc 0, bao gồm 11 số',
                })
                .required(_mesRequired),
        default: '',
        col: 'col-md-12',
    }
}
