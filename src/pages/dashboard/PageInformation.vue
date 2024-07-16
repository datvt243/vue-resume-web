<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { ref, shallowRef, onMounted } from 'vue'
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
import { modalDefault as model, modalSocial } from '@/models/information.model'
const formFields = shallowRef(model)
/* const socialMediaFields = ref(modalSocial) */
const socialMediaFields = ref([
    {
        name: 'socialMedia.github',
        label: 'Github',
        type: 'text',
        default: '',
        col: 'col-md-12',
    },
    {
        name: 'socialMedia.linkedin',
        label: 'Linkedin',
        type: 'text',
        default: '',
        col: 'col-md-12',
    },
    {
        name: 'socialMedia.website',
        label: 'Website',
        type: 'text',
        default: '',
        col: 'col-md-12',
    },
])

/**
 *
 */
const { document, updateDoc, updatePatchDoc } = useDocument({ collection: 'candidate', fields: formFields.value })

onMounted(() => {
    const candidate = canidate.getCandidate

    /** gán value cho doc */
    for (const k of Object.keys(document)) {
        document[k] = candidate[k]
    }

    const { socialMedia = {} } = candidate

    for (const field of socialMediaFields.value) {
        const { name } = field
        const [, key] = name.split('.')
        field['value'] = socialMedia[key] || ''
    }
})

async function handleUpdate(values) {
    const _newValues = { ...values }

    _newValues._id = canidate.getId
    if (!_newValues._id) {
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
    })({ ..._newValues })

    await updateDoc(data, res => {
        const { data } = res
        canidate.setCandidateByField({ ...data })
    })
}

async function handleUpdateSocialNetwork(values) {
    const { socialMedia } = values
    const _id = canidate.getId

    if (!_id) return false

    await updatePatchDoc({ _id, socialMedia }, res => {
        const { data } = res
        const { socialMedia } = data
        canidate.setCandidateByField({ socialMedia })
    })
}
</script>

<template>
    <div class="block-container mb-5">
        <Heading text="Thông tin cơ bản" />
        <VeeForm
            :key="'frm1'"
            :fields="formFields"
            :document="document"
            :submit-fn="handleUpdate"
            :submit-text="'Cập nhật'"
            buttonPosition="center"
        />
    </div>
    <div class="block-container">
        <Heading text="Liên kết mạng xã hội" />
        <VeeForm
            :key="'frm1'"
            :fields="socialMediaFields"
            :submit-fn="handleUpdateSocialNetwork"
            :submit-text="'Cập nhật'"
            buttonPosition="center"
        />
    </div>
</template>
