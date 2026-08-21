<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { inject } from 'vue'
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
        icon: 'fa-solid fa-envelope',
        text: "We'll never share your email with anyone else.",
        placeholder: 'Vui lòng nhập Email',
        valid: yup => yup.string().email().required(),
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        icon: 'fa-solid fa-lock',
        valid: yup => yup.string().required(),
    },
    {
        name: 'repassword',
        label: 'Nhập lại Mật khẩu',
        type: 'password',
        icon: 'fa-solid fa-lock',
        valid: yup =>
            yup
                .string()
                .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
                .required('Vui lòng nhập lại mật khẩu'),
    },
]
</script>

<template>
    <div class="register-page d-flex align-items-center justify-content-center">
        <div class="auth-card">
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
    </div>
</template>

<style scoped lang="scss">
.register-page {
    min-height: 70vh;
}

.auth-card {
    width: 100%;
    max-width: 440px;
    padding: 2rem 2.25rem;
    border-radius: 1rem;
    background-color: var(--bs-tertiary-bg);
    border: 1px solid var(--bs-border-color-translucent);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.25);
}
</style>
