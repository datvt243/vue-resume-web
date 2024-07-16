<template>
    <div class="ck-wrapper">
        <CKEditor.component :editor="editor" v-model="model" :config="editorConfig" tag-name="textarea" />
    </div>
</template>

<script setup>
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, Undo, List, Heading } from 'ckeditor5'
import CKEditor from '@ckeditor/ckeditor5-vue'

import 'ckeditor5/ckeditor5.css'
import 'ckeditor5-premium-features/ckeditor5-premium-features.css'
import './custom.scss'

import { defineModel, defineProps, computed, useAttrs } from 'vue'

const model = defineModel({ type: String, default: '' })
const attrs = useAttrs()

const editor = ClassicEditor
const editorConfig = {
    plugins: [Bold, Essentials, Italic, Paragraph, Undo, List, Heading],
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList', '|', 'undo', 'redo'],
    height: 500,
    placeholder: attrs?.placeholder || 'Vui lòng nhập',
    name: 'description',
}

const cssHeight = computed(() => {
    const _height = attrs?.height || 200
    return typeof _height === 'number' ? `${_height}px` : _height
})
/* const editorData = ref('<p>Hello from CKEditor 5 in Vue!</p>') */

/* export default {
    name: 'app',
    components: {
        ckeditor: CKEditor.component,
    },
    data() {
        return {
            editorData: '<p>Hello from CKEditor 5 in Vue!</p>',
            editor: ClassicEditor,
            editorConfig: {
                plugins: [Bold, Essentials, Italic, Paragraph, Undo],
                toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
            },
        }
    },
} */
</script>

<style scoped>
:deep(.ck-editor__editable_inline:not(.ck-comment__input *)) {
    min-height: v-bind('cssHeight');
}
</style>
