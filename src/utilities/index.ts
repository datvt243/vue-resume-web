/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

type StrDate = number | string
type formatStringDate = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'MM/YYYY'
type Str = 'dd' | 'mm' | 'yyyy'

const getDate = (date: number) => {
    const d = new Date(date)
    let _y: StrDate = d.getFullYear(),
        _m: StrDate = d.getMonth() + 1,
        _d: StrDate = d.getDate()
    _m = _m < 9 ? `0${_m}` : _m
    _d = _d < 9 ? `0${_d}` : _d
    return { d: _d, m: _m, y: _y }
}
const getObject = (data: { d: StrDate; m: StrDate; y: StrDate }): Record<string, string> => {
    const { d, m, y } = data
    return {
        dd: d + '',
        mm: m + '',
        yyyy: y + '',
    }
}

export const formatDate = (date: null | number, format: formatStringDate = 'DD/MM/YYYY'): string => {
    if (!date) return '--/--'
    const { d, m, y } = getDate(date)
    const obj = getObject({ d, m, y })

    let _result = ''

    const split = format.split('/') as Array<Str>
    for (let i = 0, _stop = split.length; i < _stop; i++) {
        const s: Str = split[i]
        const _val = obj?.[s.toLocaleLowerCase()] || ''
        _result += `${i !== 0 ? '/' : ''}${_val}`
    }

    return _result
}

export const formatDateToInput = (date: number | null): string => {
    if (!date) return '--/--'
    const { d, m, y } = getDate(date)
    return `${y}-${m}-${d}`
}
