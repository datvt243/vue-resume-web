<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'
import VeeFormGeneralInformationUpdate from '@/components/veevalidate/VeeFormGeneralInformationUpdate.vue'

import { ref, shallowRef, onMounted, watch, provide, computed } from 'vue'
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
const formFields = shallowRef(model)

/**
 *
 */
const { generalInformation, getData } = useCandidate({ field: 'generalInformation', collection: 'general-information' })
const { document, updateDoc } = useDocument({ collection: 'general-information', fields: formFields.value })

const canidateProvide = computed(() => ({
    _id: canidate.getGeneralInformation?._id || '',
}))
provide('candidate', canidateProvide)
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
        <Heading text="Thông tin chung">
            <div class="btn-group">
                <Button @click="getData?.()" icon="fa-solid fa-repeat" type="outline-info" size="sm"></Button>
            </div>
        </Heading>
        <VeeForm :fields="formFields" :document="document" :submit-fn="handleUpdate" :submit-text="'Cập nhật'" />
    </div>

    <template v-if="isLoading">
        <hr class="border-success mb-5" />

        <VeeFormGeneralInformationUpdate
            key="professionalSkills"
            :model-value="generalInformation"
            :heading="'Kỹ năng chuyên môn'"
            :field-key="'professionalSkills'"
            :has-button-add="true"
            :fields="professionalSkillFields"
        />

        <VeeFormGeneralInformationUpdate
            key="personalSkills"
            :model-value="generalInformation"
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
            :heading="'Ngoại ngữ'"
            :field-key="'foreignLanguages'"
            :has-button-add="true"
            :fields="foreignLanguageFields"
        />
    </template>
</template>
