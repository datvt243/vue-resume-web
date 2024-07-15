<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'
import VeeFormGeneralInformationUpdate from '@/components/veevalidate/VeeFormGeneralInformationUpdate.vue'

import { ref, shallowRef, onMounted, onBeforeMount, watch } from 'vue'
import { useDocument } from '@/composables/useDocument'
import { useCandidate } from '@/composables/useCandidate'

/**
 *
 */
const isLoading = ref(false)

/**
 * store
 */
import { candidateStore } from '@/stores/candidate'
const canidate = candidateStore()

/**
 * import
 */
import model from '@/models/generalInformation.modal'
const _mesRequired = 'Vui lòng nhập'
const formFields = shallowRef([
    {
        name: '_id',
        label: 'ID',
        type: 'hidden',
        placeholder: 'Vui lòng nhập Vị trí mong muốn',
        valid: yup => yup.string().nullable().default(null),
        default: null,
    },
    {
        name: 'positionDesired',
        label: 'Vị trí mong muốn',
        type: 'text',
        placeholder: 'Vui lòng nhập Vị trí mong muốn',
        valid: yup => yup.string().max(50).trim().required(_mesRequired),
    },
    {
        name: 'career',
        label: 'Ngành nghề',
        type: 'text',
        placeholder: 'Vui lòng nhập Ngành nghề',
        valid: yup => yup.string().max(50).trim().required(_mesRequired),
    },
    {
        name: 'levelCurrent',
        label: 'Cấp bậc hiện tại',
        type: 'select',
        options: [
            { text: 'Thực tập sinh', value: 'intern' },
            { text: 'Nhân viên', value: 'staff' },
            { text: 'Trưởng nhóm', value: 'teamLeader' },
            { text: 'Quản lý', value: 'manager' },
            { text: 'Phó giám đốc', value: 'viceDirector' },
            { text: 'Giám đốc', value: 'director' },
            { text: 'Tổng giám đốc', value: 'ceo' },
        ],
        default: 'staff',
        placeholder: 'Vui lòng nhập Cấp bậc hiện tại',
        valid: yup => yup.string().max(50).trim().required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'levelDesired',
        label: 'Cấp bậc mong muốn',
        type: 'select',
        options: [
            { text: 'Thực tập sinh', value: 'intern' },
            { text: 'Nhân viên', value: 'staff' },
            { text: 'Trưởng nhóm', value: 'teamLeader' },
            { text: 'Quản lý', value: 'manager' },
            { text: 'Phó giám đốc', value: 'viceDirector' },
            { text: 'Giám đốc', value: 'director' },
            { text: 'Tổng giám đốc', value: 'ceo' },
        ],
        default: 'staff',
        placeholder: 'Vui lòng nhập Cấp bậc mong muốn',
        valid: yup => yup.string().max(50).trim().required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'education',
        label: 'Trình độ',
        type: 'select',
        options: [
            { text: 'Trung học phổ thông', value: 'highSchool' },
            { text: 'Trung cấp/Cao đẳng', value: 'associateDegree' },
            { text: 'Đại học', value: 'bachelorDegree' },
            { text: 'Thạc sĩ', value: 'masterDegree' },
            { text: 'Tiến sĩ', value: 'doctorateDegree' },
        ],
        default: 'bachelorDegree',
        placeholder: 'Vui lòng nhập Trình độ',
        valid: yup => yup.string().trim().max(50).required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'yearsOfExperience',
        label: 'Số năm kinh nghiệm',
        type: 'number',
        placeholder: 'Vui lòng nhập Số năm kinh nghiệm',
        valid: yup =>
            yup
                .number('Vui lòng nhập vào số')
                .integer('Vui lòng nhập vào số nguyên')
                .min(0, 'Số năm kinh nghiệm phải lớn hơn 0')
                .required(_mesRequired),
        col: 'col-md-6',
    },
    {
        name: 'salaryDesired',
        label: 'Mức lương mong muốn',
        type: 'currency',
        placeholder: 'Vui lòng nhập Mức lương mong muốn',
        valid: yup =>
            yup
                .number('Vui lòng nhập vào số')
                .integer('Vui lòng nhập vào số nguyên')
                .positive('Mức lương mong muốn phải lớn hơn 0')
                .required(_mesRequired),
    },
    {
        name: 'workForm',
        label: 'Hình thức làm việc',
        type: 'select',
        options: [
            { value: 'fulltime', text: 'Toàn thời gian' },
            { value: 'parttime', text: 'Bán thời gian' },
            { value: 'temporary', text: 'Thời vụ' },
            { value: 'internship', text: 'Thử việc' },
            { value: 'freelance', text: 'Freelance' },
            { value: 'contract', text: 'Hợp đồng' },
            { value: 'remote', text: 'Làm việc từ xa' },
            { value: 'consultant', text: 'Cộng tác viên' },
        ],
        placeholder: 'Vui lòng nhập Mức lương mong muốn',
        valid: yup => yup.string().required(_mesRequired),
        default: 'fulltime',
    },
    {
        name: 'workLocation',
        label: 'Địa điểm làm việc',
        type: 'text',
        default: '',
        placeholder: 'Vui lòng nhập Địa điểm làm việc',
        valid: yup => yup.string().required(_mesRequired),
    },
    {
        name: 'careerGoal',
        label: 'Mục tiêu công việc',
        type: 'textarea',
        default: '',
        placeholder: 'Vui lòng nhập Mức lương mong muốn',
        valid: yup => yup.string().required(_mesRequired),
    },
])

/**
 *
 */
const { generalInformation } = useCandidate({ field: 'generalInformation', collection: 'general-information' })
const { document, updateDoc } = useDocument({ collection: 'general-information', fields: formFields.value })

onMounted(() => {
    isLoading.value = true
})
watch(generalInformation, val => {
    const _val = Array.isArray(val) ? val?.[0] || {} : val
    for (const [key, value] of Object.entries(_val)) {
        document[key] = value
    }
})

async function handleUpdate(values) {
    const document = { ...values }

    console.log({ document })
    await updateDoc(document, res => {
        const { data } = res
        canidate.setCandidateByField({ generalInformation: [data] })
    })
}

const foreignLanguageFields = [
    {
        name: 'language',
        label: 'Ngôn ngữ',
        type: 'text',
        placeholder: 'Vui lòng nhập Ngôn ngữ',
        valid: yup => yup.string().trim().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'level',
        label: 'Cấp độ',
        type: 'select',
        options: [
            { value: 'basic', text: 'Cơ bản' },
            { value: 'intermediate', text: 'Trung bình' },
            { value: 'advanced', text: 'Khá' },
            { value: 'expert', text: 'Giỏi' },
        ],
        placeholder: 'Vui lòng nhập Cấp độ',
        valid: yup => yup.string().trim().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
]

const professionalSkillFields = [
    {
        name: 'name',
        label: 'Kỹ năng',
        type: 'text',
        placeholder: 'Vui lòng nhập kỹ năng',
        valid: yup => yup.string().trim().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
        default: '',
    },
    {
        name: 'exp',
        label: 'Năm kinh nghiệm',
        type: 'number',
        placeholder: 'Vui lòng nhập Năm kinh nghiệm',
        valid: yup => yup.number('Vui lòng nhập vào số').positive('Số năm kinh nghiệm nhỏ nhất bằng 0').required(_mesRequired),
        default: '',
    },
]
</script>

<template>
    <div class="block-container mb-5">
        <Heading text="Thông tin chung" />
        <VeeForm :fields="formFields" :document="document" :submit-fn="handleUpdate" :submit-text="'Cập nhật'" />
    </div>

    <template v-if="isLoading">
        <hr class="border-success mb-5" />

        <VeeFormGeneralInformationUpdate
            key="professionalSkills"
            :model-value="generalInformation"
            :id="canidate.getGeneralInformation?._id || ''"
            :heading="'Kỹ năng chuyên môn'"
            :field-key="'professionalSkills'"
            :has-button-add="true"
            :fields="professionalSkillFields"
        />

        <VeeFormGeneralInformationUpdate
            key="personalSkills"
            :model-value="generalInformation"
            :id="canidate.getGeneralInformation?._id || ''"
            :heading="'Kỹ năng cá nhân'"
            :field-key="'personalSkills'"
            :has-button-add="true"
            :fields="[
                {
                    name: 'name',
                    label: 'Kỹ năng',
                    type: 'text',
                    placeholder: 'Vui lòng nhập kỹ năng',
                    valid: yup => yup.string().trim().max(100, 'Tối đa 100 ký tự').required(_mesRequired),
                    default: '',
                },
            ]"
        />

        <VeeFormGeneralInformationUpdate
            key="foreignLanguages"
            :model-value="generalInformation"
            :id="canidate.getGeneralInformation?._id || ''"
            :heading="'Ngoại ngữ'"
            :field-key="'foreignLanguages'"
            :has-button-add="true"
            :fields="foreignLanguageFields"
        />
    </template>
</template>
