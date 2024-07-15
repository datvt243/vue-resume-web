export const formatDateMMYYYY = (date: number | null): string => {
    if (!date) return '--/--'
    const _date = new Date(date)

    const _y = _date.getFullYear(),
        _m = _date.getMonth() + 1

    let _str_m = _m < 9 ? `0${_m}` : _m
    return `${_str_m}/${_y}`
}

export const formatDate = (date: number | null): string => {
    if (!date) return '--/--'
    const _date = new Date(date)

    const _y = _date.getFullYear(),
        _m = _date.getMonth() + 1,
        _d = _date.getDate()
    let _str_m = _m < 9 ? `0${_m}` : _m,
        _str_d = _d < 9 ? `0${_d}` : _d
    return `${_str_d}/${_str_m}/${_y}`
}

export const formatDateToInput = (date: number | null): string => {
    if (!date) return '--/--'
    const _date = new Date(date)

    let _y = _date.getFullYear(),
        _m = _date.getMonth() + 1,
        _d = _date.getDate()
    let _str_m = _m < 9 ? `0${_m}` : _m,
        _str_d = _d < 9 ? `0${_d}` : _d
    return `${_y}-${_str_m}-${_str_d}`
}
