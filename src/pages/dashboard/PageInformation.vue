<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'

import { ref, shallowRef, onMounted } from 'vue'
import { useDocument, useHelper } from '@/composables'
import { getLocalizedText, wrapLocalizedText } from '@/utilities/index'

/* import { useDocument } from '@/composables/useDocument' */

/**
 * store
 */
import { candidateStore } from '@/stores/candidate'
const candidate = candidateStore()

/**
 *
 */
/* import { useHelper } from '@/composables/useHelper' */
const { toast } = useHelper()

/**
 *
 */
import { modalDefault as model } from '@/models/information.model'
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

// giữ lại giá trị introduction gốc (có thể là object { vi, en } từ backend)
// để khi lưu lại không mất phần `en` — xem utilities/index.ts
const originalIntroduction = ref(null)

onMounted(() => {
    const _candidate = candidate.getCandidate

    /** gán value cho doc */
    for (const k of Object.keys(document)) {
        document[k] = _candidate[k]
    }
    originalIntroduction.value = _candidate.introduction
    document.introduction = getLocalizedText(_candidate.introduction)

    const { socialMedia = {} } = _candidate

    for (const field of socialMediaFields.value) {
        const { name } = field
        const [, key] = name.split('.')
        field['value'] = socialMedia[key] || ''
    }
})

async function handleUpdate(values) {
    const _newValues = { ...values }

    _newValues._id = candidate.getId
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
        val.introduction = wrapLocalizedText(val.introduction, originalIntroduction.value)

        return val
    })({ ..._newValues })

    await updateDoc(data, res => {
        const { data } = res
        candidate.setCandidateByField({ ...data })
    })
}

async function handleUpdateSocialNetwork(values) {
    const { socialMedia } = values
    const _id = candidate.getId

    if (!_id) return false

    await updatePatchDoc({ _id, socialMedia }, res => {
        const { data } = res
        const { socialMedia } = data
        candidate.setCandidateByField({ socialMedia })
    })
}
</script>

<template>
    <div class="block-container mb-5">
        <Heading text="Thông tin cơ bản" />
        <!-- <Teleport to="#reload">
            <button class="btn btn-sm btn-outline-info" @click="getData?.()">
                <FontAwesomeIcon icon="fa-solid fa-repeat" /> Reload
            </button>
        </Teleport> -->

        <VeeForm
            :key="'frm-basic-info'"
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
            :key="'frm-social-media'"
            :fields="socialMediaFields"
            :submit-fn="handleUpdateSocialNetwork"
            :submit-text="'Cập nhật'"
            buttonPosition="center"
        />
    </div>
</template>
