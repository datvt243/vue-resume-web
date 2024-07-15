<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { ref, inject } from 'vue'
import { handleRegister } from '@/services/auth'

const refSpinner = inject('spinner')
const refToast = inject('toast')

const formFields = [
    /* {
        name: 'firstName',
        label: 'Họ',
        type: 'text',
        placeholder: 'Vui lòng nhập Họ',
        valid: (yup) => yup.string().min(0).max(10).required(),
        col: 'col-md-6',
    },
    {
        name: 'lastName',
        label: 'Tên',
        type: 'text',
        placeholder: 'Vui lòng nhập Tên',
        valid: (yup) => yup.string().min(0).max(30).required(),
        col: 'col-md-6',
    }, */
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        text: "We'll never share your email with anyone else.",
        placeholder: 'Vui lòng nhập Email',
        valid: yup => yup.string().email().required(),
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        valid: yup => yup.string().required(),
    },
    {
        name: 'repassword',
        label: 'Nhập lại Mật khẩu',
        type: 'password',
        valid: yup => yup.string().required('Email là bắt buộc'),
    },
]
</script>

<template>
    <div class="auth-container m-auto" style="max-width: 500px">
        <Heading text="Đăng ký" />
        <VeeForm
            :fields="formFields"
            :submit-fn="
                values => {
                    handleRegister(values, { toast: refToast, loading: refSpinner })
                }
            "
            :submit-text="'Register'"
        />
    </div>
</template>
