<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

import { defineProps, defineExpose, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import {
    FrmInput,
    FrmPwd,
    FrmTextArea,
    FrmCheckbox,
    FrmSelect,
    FrmCurrency,
    FrmDate,
    FrmCkediter,
    FrmDatePicker,
} from '@/components/veevalidate'

const props = defineProps({
    fields: { type: Array, default: () => [] },
    submitFn: { type: Function, default: () => {} },
    submitText: { type: String, default: 'Submit' },
    buttonPosition: { type: String, default: 'start' },

    // document
    document: { type: Object, default: () => ({}) },
    resetAfterSave: { type: Boolean, default: false },
})

const getFields = computed(() => {
    return props.fields.map(e => {
        delete e.valid
        return e
    })
})
const getFieldId = computed(() => {
    const _find = props.fields.find(e => e.name === '_id')
    return _find ? _find : null
})

/**
 * Khởi tạo Schema - để validate
 */
const schema = computed(() => {
    const object = {}
    for (const field of props.fields) {
        object[field.name] = field?.valid?.(yup)
    }
    return yup.object(object).json()
})

/**
 * Khởi tạo From
 */
const { values, errors, handleSubmit, meta, setValues, resetForm } = useForm({
    validationSchema: schema,
    /* initialValues: (() => {
        const keys = props.fields.map(e => ({ name: e.name, default: e.default }))
        const _newDoc = {}
        for (const k of keys) {
            
            _newDoc[k.name] = k.default
        }
        return _newDoc
    })(), */
})
watch(
    () => props.document,
    doc => {
        const keys = getFields.value.map(e => e.name)
        const _newDoc = {}
        for (const k of keys) {
            _newDoc[k] = doc[k]
        }
        setValues(_newDoc)
        if (!doc._id) {
            reset()
        }
    },
    { deep: true },
)

defineExpose({
    reset,
})

function reset() {
    resetForm({
        errors: getFields.value.reduce((obj, e) => ({ [e.nam]: '' })),
    })
}

function onSubmit() {
    /**
     * callback
     */

    if (!meta.value.valid) {
        return false
    }

    props?.submitFn?.(values)

    if (props.resetAfterSave) {
        resetForm()
    }
}

const objComponent = {
    checkbox: FrmCheckbox,
    currency: FrmCurrency,
    select: FrmSelect,
    textarea: FrmTextArea,
    ckediter: FrmCkediter,
    password: FrmPwd,
    /* date: FrmDate, */
    date: FrmDatePicker,
    text: FrmInput,
    default: FrmInput,
}
</script>

<template>
    <form class="form">
        <div class="row">
            <template v-for="el in getFields.filter(f => f.type !== 'hidden')" :key="el.nam">
                <div :class="['col-12', el?.col || 'col-md-12']">
                    <component :is="objComponent?.[`${el.type}`] || objComponent['default']" :key="el?.name" v-bind="el" />
                    <!-- <template v-if="el.type === 'checkbox'">
                        <FrmCheckbox :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'currency'">
                        <FrmCurrency :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'select'">
                        <FrmSelect :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'textarea'">
                        <FrmTextArea :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'ckediter'">
                        <FrmCkediter :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'password'">
                        <FrmPwd :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else-if="el.type === 'date'">
                        <FrmDate :key="el?.name" v-bind="el" />
                    </template>
                    <template v-else>
                        <FrmInput :key="el?.name" v-bind="el" />
                    </template> -->
                </div>
            </template>
        </div>
        <FrmInput v-if="getFieldId" key="_id" v-bind="getFieldId" type="hidden" label="" class="mb-0" />
        <div class="footer d-flex my-3" :class="[`justify-content-${props.buttonPosition}`]">
            <button type="button" class="btn btn-success" @click="onSubmit" :disabled="!meta.valid">{{ submitText }}</button>
            <slot name="button"></slot>
        </div>
    </form>
</template>
