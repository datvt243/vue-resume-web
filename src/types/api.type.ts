/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

export interface Response {
    success: boolean
    message: string
    errors: Record<string, string> | string[]
    data: Document | Document[]
}

export interface Document {
    _id: string
    [key: string]: any
}
