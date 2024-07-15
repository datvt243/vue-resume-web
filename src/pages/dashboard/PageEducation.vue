<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'
import Modal from '@/components/Modal.vue'
import EducationItem from '@/components/education/EducationItem.vue'

import { ref, shallowRef } from 'vue'
import { useCandidate } from '@/composables/useCandidate'
import { useDocument } from '@/composables/useDocument'

import model from '@/models/education.model'
import { formatDateToInput } from '@/utilities/index'

const { educations: dataList, removeRecordById, addRecordToList } = useCandidate({ field: 'educations', collection: 'education' })

/**
 *
 */
const { document, updateDoc, deleteDoc } = useDocument({ collection: 'education', fields: model })

/**
 *  modal
 */
const refModal = ref()
const refVeeForm = ref()
const formFields = shallowRef(model)

/**
 *
 * Method
 */
async function handleUpdate(values) {
    /**
     * re-format data
     */
    const data = (val => {
        val.startDate = +new Date(val.startDate)
        val.endDate = +new Date(val.endDate)
        !val.isCurrent && (val.isCurrent = false)
        return val
    })({ ...values })

    await updateDoc(data, res => {
        const { data } = res
        addRecordToList(data)
    })
}
async function handleDelete(doc) {
    deleteDoc({ ...doc }, 'school', res => {
        const { data } = res
        removeRecordById(data._id)
    })
}

function showModalEditDoc(doc) {
    const fields = formFields.value.map(e => e.name)
    for (const f of new Set(['_id', ...fields])) {
        document[f] = doc[f]
    }

    document.startDate = formatDateToInput(document.startDate)
    document.endDate = formatDateToInput(document.endDate)

    refModal.value?.show()
}

function showModalCreateDoc() {
    for (const k of formFields.value) {
        document[k.name] = k.default
    }
    refModal.value?.show()
    refVeeForm.value?.reset()
}
</script>

<template>
    <div class="mb-4">
        <Heading text="Học vấn">
            <button class="btn btn-sm btn-success" @click="showModalCreateDoc()">
                <FontAwesomeIcon icon="fa-solid fa-plus" />
            </button>
        </Heading>

        <div v-if="dataList.length" class="clearfix">
            <ListTransition>
                <li v-for="edu in dataList" :key="edu._id">
                    <EducationItem
                        :model-value="edu"
                        icon="fa-graduation-cap"
                        @on-edit="showModalEditDoc"
                        @on-delete="handleDelete"
                    />
                </li>
            </ListTransition>
        </div>
        <NoData v-else />
    </div>

    <Modal ref="refModal" :title="document._id ? `Chỉnh sửa: ${document.school}` : 'Thêm mới Học vấn'" is-hidden-footer>
        <div class="block-container">
            <VeeForm
                ref="refVeeForm"
                :fields="formFields"
                :document="document"
                :submit-fn="handleUpdate"
                :submit-text="document._id ? 'Cập nhật' : 'Thêm mới'"
                buttonPosition="end"
            >
                <template #button>
                    <button type="button" class="btn btn-secondary mx-3" data-bs-dismiss="modal">Đóng</button>
                </template>
            </VeeForm>
        </div>
    </Modal>
</template>
