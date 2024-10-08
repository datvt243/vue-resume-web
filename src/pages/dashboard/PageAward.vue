<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import VeeForm from '@/components/veevalidate/VeeForm.vue'
import Modal from '@/components/Modal.vue'
import ItemTemplate from '@/components/global/ItemTemplate.vue'

import { ref, shallowRef } from 'vue'
import { useCandidate } from '@/composables/useCandidate'
import { useDocument } from '@/composables/useDocument'

import model from '@/models/award.model.ts'

import { formatDateToInput, formatDate } from '@/utilities/index'

const { awards: dataList, removeRecordById, addRecordToList, getData } = useCandidate({ field: 'awards' })

/**
 *
 */
const { document, updateDoc, deleteDoc } = useDocument({ collection: 'award', fields: model })

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
        val.issueDate = +new Date(val.issueDate)
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
        <Heading text="Giải thưởng">
            <div class="btn-group">
                <Button @click="showModalCreateDoc()" icon="fa-solid fa-plus" type="outline-success" size="sm"></Button>
                <Button @click="getData?.()" icon="fa-solid fa-repeat" type="outline-info" size="sm"></Button>
            </div>
        </Heading>

        <div v-if="dataList.length" class="clearfix">
            <ListTransition>
                <li v-for="item in dataList" :key="item._id">
                    <ItemTemplate
                        :model-value="{
                            title: item.name,
                            subTitle: item.organization,
                            date: () => {
                                const { issueDate } = item
                                const _start = formatDate(issueDate, 'MM/YYYY')
                                return `${_start}`
                            },
                            description: item.description,
                        }"
                        icon="fa-award"
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

    <Modal ref="refModal" :title="document._id ? `Chỉnh sửa: ${document.school}` : 'Thêm mới Giải thưởng'" is-hidden-footer>
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
