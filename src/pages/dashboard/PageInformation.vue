<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { handleBase } from '@/services/base'
import { ref, shallowRef, inject, onMounted } from 'vue'
import { useDocument } from '@/composables/useDocument'

/**
 * store
 */
import { candidateStore } from '@/stores/candidate'
const canidate = candidateStore()

/**
 *
 */
import { useHelper } from '@/composables/useHepler'
const { toast } = useHelper()

/**
 *
 */
/* import model from '@/models/information.model' - has err and i have no ideas */
import { phoneRegex } from '@/config/regex.config'
const _mesRequired = 'Vui lòng nhập'
const formFields = shallowRef([
    {
        name: 'firstName',
        label: 'Họ',
        type: 'text',
        placeholder: 'Vui lòng nhập Họ',
        valid: yup => yup.string().min(0).max(10, 'Tối đa 10 ký tự').required(_mesRequired),
        default: '',
        col: 'col-md-6',
    },
    {
        name: 'lastName',
        label: 'Tên',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên',
        valid: yup => yup.string().min(0).max(30, 'Tối đa 30 ký tự').required(_mesRequired),
        default: '',
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
        valid: yup => yup.string().required(_mesRequired),
        default: 0,
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
        valid: yup => yup.string().required(_mesRequired),
        default: 0,
        col: 'col-md-6',
    },
    {
        name: 'birthday',
        label: 'Ngày sinh',
        type: 'date',
        valid: yup => yup.string().required(_mesRequired),
        default: new Date('1990-01-01'),
        col: 'col-md-12',
    },
    {
        name: 'address',
        label: 'Địa chỉ',
        type: 'text',
        valid: yup => yup.string().required(_mesRequired),
        default: '',
        col: 'col-md-12',
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
        default: '',
        col: 'col-md-12',
    },
    {
        name: 'introduction',
        label: 'Giới thiệu bản thân',
        type: 'textarea',
        valid: yup => yup.string().required(_mesRequired),
        default: '',
        col: 'col-md-12',
    },
])

/**
 *
 */
const { updateDoc } = useDocument({ collection: 'candidate', fields: formFields.value })

onMounted(() => {
    const candidate = canidate.getCandidate
    for (const field of formFields.value) {
        const { name } = field
        ;[name] in candidate && (field['value'] = candidate[name])
    }
})

async function handleUpdate(values) {
    const document = { ...values }

    document._id = canidate.getId
    if (!document._id) {
        toast?.({
            message: 'Xảy ra lỗi',
            bg: 'danger',
        })
    }
    const data = (val => {
        val.gender = !!val.gender
        val.marital = !!val.marital
        val.birthday = +new Date(val.birthday)

        return val
    })({ ...document })

    await updateDoc(data, res => {
        const { data } = res
        canidate.setCandidateByField({ ...data })
    })
}
</script>

<template>
    <div class="block-container">
        <Heading text="Thông tin cơ bản" />
        <VeeForm :key="'frm1'" :fields="formFields" :submit-fn="handleUpdate" :submit-text="'Cập nhật'" buttonPosition="center" />
    </div>
</template>
