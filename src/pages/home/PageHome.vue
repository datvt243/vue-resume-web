<script setup>
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Trang tổng quan (route '/', mở khi click logo "Resume API")
 * — section 1 (thông tin cơ bản) và tình trạng open-to-work là dữ liệu
 * thật từ candidateStore. Section 2 (lượt xem CV) và section 4 (% hoàn
 * thành hồ sơ) chưa có API đứng sau, hiển thị số liệu tạm/mẫu — xem chú
 * thích ngay tại chỗ khai báo. Section 3 (đính kèm CV) chỉ có phần tải
 * xuống là thật (dùng lại endpoint download-pdf có sẵn); nút "Đính kèm
 * file mới" mới là UI thôi, backend chưa có endpoint lưu file upload.
 */

import { computed, ref } from 'vue'
import { candidateStore } from '@/stores/candidate'
import { authStore } from '@/stores/auth'
import { useHelper } from '@/composables/useHelper'
import { API } from '@/config/api.config'

const candidate = candidateStore()
const auth = authStore()
const { toast } = useHelper()

/**
 * section 1: thông tin cơ bản
 */
const info = computed(() => candidate.getCandidate)
const generalInfo = computed(() => candidate.getGeneralInformation)

const fullName = computed(() => {
    const { firstName = '', lastName = '' } = info.value
    return `${firstName} ${lastName}`.trim() || 'Chưa cập nhật'
})
const initials = computed(() => {
    const { firstName = '', lastName = '' } = info.value
    return (`${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U').toUpperCase()
})
// backend candidate chưa có field avatar — component vẫn kiểm tra "nếu
// có" để không phải sửa lại khi backend bổ sung field này sau
const avatarUrl = computed(() => info.value?.avatar || '')
const email = computed(() => info.value?.email || auth.getUser?.email || '')
const position = computed(() => generalInfo.value?.positionDesired || 'Chưa cập nhật')
const isOpenToWork = computed(() => !!generalInfo.value?.openToWork)

/**
 * section 2: lượt xem CV — chưa có API đếm lượt xem, tạm để 0
 */
const cvViewCount = 0

/**
 * section 3: đính kèm CV
 * - tải CV hiện tại: dùng lại endpoint có sẵn (giống Header.vue)
 * - "đính kèm file mới": chỉ chọn file + hiển thị tên, CHƯA gửi lên
 *   server vì backend chưa có endpoint lưu file upload
 */
const _host = window.location.host === 'localhost' ? 'http://localhost:3001/' : API
const downloadCVUrl = computed(() => `${_host}api/v1/download-pdf?token=${auth.getToken}`)

const fileInput = ref(null)
const selectedFileName = ref('')
function triggerFilePicker() {
    fileInput.value?.click()
}
function handleSelectFile(e) {
    const file = e.target?.files?.[0]
    e.target.value = ''
    if (!file) return

    selectedFileName.value = file.name
    toast?.({
        message: `Đã chọn "${file.name}" — tính năng lưu file lên server đang chờ backend cập nhật, file chưa được gửi lên.`,
        bg: 'info',
    })
}

/**
 * section 4: % hoàn thành hồ sơ — tính năng thật chưa có, số liệu mẫu
 */
const profileCompletion = 72
</script>

<template>
    <div class="block-container mb-4">
        <Heading text="Thông tin cơ bản" />
        <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
            <div class="home-avatar">
                <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
                <span v-else>{{ initials }}</span>
            </div>
            <div class="flex-grow-1">
                <p class="h5 mb-1">{{ fullName }}</p>
                <p class="mb-1 opacity-75">
                    <FontAwesomeIcon icon="fa-solid fa-envelope" class="me-2" />{{ email || 'Chưa cập nhật' }}
                </p>
                <p class="mb-2 opacity-75">{{ position }}</p>
                <span class="badge rounded-pill" :class="isOpenToWork ? 'text-bg-success' : 'text-bg-secondary'">
                    <FontAwesomeIcon :icon="isOpenToWork ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'" class="me-1" />
                    {{ isOpenToWork ? 'Đang mở tìm việc' : 'Không tìm việc' }}
                </span>
            </div>
        </div>
    </div>

    <div class="block-container mb-4">
        <Heading text="Lượt xem CV" />
        <p class="h2 mb-0">
            {{ cvViewCount }}
            <span class="h6 opacity-50 fw-normal">(chưa có API đếm lượt xem, tạm hiển thị 0)</span>
        </p>
    </div>

    <div class="block-container mb-4">
        <Heading text="Đính kèm CV" />
        <div class="d-flex flex-wrap align-items-center gap-2">
            <a class="btn btn-sm btn-outline-success rounded-pill" :href="downloadCVUrl" target="_blank">
                <FontAwesomeIcon icon="fa-solid fa-download" class="me-2" />Tải CV hiện tại
            </a>
            <Button icon="fa-solid fa-paperclip" type="outline-secondary" size="sm" text="Đính kèm file mới" @click="triggerFilePicker" />
            <input ref="fileInput" type="file" accept="application/pdf" class="d-none" @change="handleSelectFile" />
            <span v-if="selectedFileName" class="small opacity-75">Đã chọn: {{ selectedFileName }}</span>
        </div>
        <p class="small opacity-50 mt-2 mb-0">Tính năng lưu file đính kèm đang chờ backend cập nhật, file chọn ở trên chưa được gửi lên server.</p>
    </div>

    <div class="block-container">
        <Heading text="Profile Information" />
        <div class="d-flex align-items-center gap-3">
            <div class="progress flex-grow-1" role="progressbar" :aria-valuenow="profileCompletion" aria-valuemin="0" aria-valuemax="100" style="height: 0.75rem">
                <div class="progress-bar bg-success" :style="{ width: `${profileCompletion}%` }"></div>
            </div>
            <span class="fw-semibold">{{ profileCompletion }}%</span>
        </div>
        <p class="small opacity-50 mt-2 mb-0">Chức năng tính % hồ sơ hoàn thành chưa có, số liệu trên là số liệu mẫu.</p>
    </div>
</template>

<style scoped lang="scss">
.home-avatar {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.25rem;
    background-color: var(--bs-green);
    color: #fff;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
