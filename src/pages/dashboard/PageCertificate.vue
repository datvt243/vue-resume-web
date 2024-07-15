<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'
import Modal from '@/components/Modal.vue'

import ItemTemplate from '@/components/ItemTemplate.vue'

import { ref, shallowRef } from 'vue'
import { useCandidate } from '@/composables/useCandidate'
import { useDocument } from '@/composables/useDocument'

import model from '@/models/certificate.model.ts'

import { formatDateToInput, formatDateMMYYYY } from '@/utilities/index'

const { certificates: dataList, removeRecordById, addRecordToList } = useCandidate({ field: 'certificates' })
const colHidden = ['_id', 'description', 'link', 'images']

/**
 *
 */
const { document, updateDoc, deleteDoc } = useDocument({ collection: 'certificate', fields: model })

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
        !val.isNoExpiration && (val.isNoExpiration = false)
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
    !document.isNoExpiration && (document.isNoExpiration = false)
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
        <Heading text="Chứng chỉ">
            <button class="btn btn-sm btn-success" @click="showModalCreateDoc()">
                <FontAwesomeIcon icon="fa-solid fa-plus" />
            </button>
        </Heading>
        <div v-if="dataList.length" class="clearfix">
            <ListTransition>
                <li v-for="item in dataList" :key="item._id">
                    <ItemTemplate
                        :model-value="{
                            title: item.name,
                            subTitle: item.organization,
                            date: () => {
                                const { startDate, endDate, isNoExpiration } = item
                                const _start = formatDateMMYYYY(startDate)
                                const _end = isNoExpiration ? 'Không thời hạn' : formatDateMMYYYY(endDate)
                                return `${_start} - ${_end}`
                            },
                            description: item.description,
                        }"
                        icon="fa-certificate"
                    >
                        <div class="btn-group">
                            <a
                                class="btn btn-sm btn-outline-danger icon"
                                href="javascript:void(0)"
                                @click="
                                    () => {
                                        deleteDoc({ ...item }, 'name', res => {
                                            const { data } = res
                                            removeRecordById(data._id)
                                        })
                                    }
                                "
                            >
                                <FontAwesomeIcon icon="fa-solid fa-trash"></FontAwesomeIcon>
                            </a>
                            <a
                                class="btn btn-sm btn-outline-warning icon"
                                href="javascript:void(0)"
                                @click="showModalEditDoc({ ...item })"
                            >
                                <FontAwesomeIcon icon="fa-solid fa-square-pen"></FontAwesomeIcon>
                            </a>
                        </div>
                    </ItemTemplate>
                </li>
            </ListTransition>
        </div>
        <NoData v-else />
    </div>

    <Modal ref="refModal" :title="document._id ? `Chỉnh sửa: ${document.school}` : 'Thêm mới Chứng chỉ'" is-hidden-footer>
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
