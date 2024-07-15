type inputType =
    | 'text'
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

interface Options {
    value: string | number | boolean
    text: string
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
