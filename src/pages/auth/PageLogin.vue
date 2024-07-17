<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */
import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { handleLogin } from '@/services/auth'
import { authStore } from '@/stores/auth'

const router = useRouter()
const refSpinner = inject('spinner')
const refToast = inject('toast')

const store = authStore()
if (store.isAuthenticated) {
    router?.push('/dashboard/information')
}

const formFields = [
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        text: "We'll never share your email with anyone else.",
        placeholder: 'Vui lòng nhập Email',
        /* value: 'david@gmail.com', */
        valid: yup => yup.string().email('Email sai định dạng').required('Email là bắt buộc'),
    },
    {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        /* value: 'david243', */
        valid: yup => yup.string().required('Mật khẩu là bắt buộc'),
    },
    {
        name: 'rememberMe',
        label: 'Ghi nhớ đăng nhập',
        type: 'checkbox',
    },
]

async function _handleLogin(values) {
    await handleLogin(values, { loading: refSpinner, toast: refToast, router })
}
</script>

<template>
    <div class="auth-container m-auto" style="max-width: 500px">
        <Heading text="Đăng nhập" />
        <VeeForm :fields="formFields" :submit-fn="_handleLogin" :submit-text="'Login'" />
    </div>
</template>
