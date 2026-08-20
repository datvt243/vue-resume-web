---
node: issue-10-grouptags-mutate-prop
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #10](https://github.com/datvt243/vue-resume-web/issues/10) —
`GroupTags.vue` dùng `toRef(props, 'modelValue')` rồi `push`/`splice` trực
tiếp lên nó → mutate array của component cha, vi phạm one-way data flow.

## Diff
`src/components/GroupTags.vue`:
- `tags = toRef(props, 'modelValue')` → `tags = ref([...props.modelValue])`
  (bản copy local) + `watch(() => props.modelValue, ...)` để sync khi cha
  đổi.
- `addTag`/`removeTag`: build mảng mới (`[...tags.value, x]` /
  `filter`) thay vì `push`/`splice` trên mảng gốc, gán vào `tags.value`
  local, `emits('update:modelValue', newTags)`, rồi mới gọi
  `props.handleAction(newTags)`.
- `addTag` thêm `if (!tag.value.trim()) return` (theo đúng code mẫu trong
  issue, tránh thêm tag rỗng).

### Fix thêm ngoài diff mẫu trong issue — có lý do cụ thể
`defineEmits(['modelValue:update'])` → `defineEmits(['update:modelValue'])`.

Lý do: tên event cũ `modelValue:update` SAI thứ tự so với convention
`update:modelValue` mà Vue's `v-model` compile ra
(`@update:modelValue="skillsGroup = $event"`). Đã verify bằng
`grep -rn "GroupTags\|modelValue:update\|update:modelValue" src/` — nơi
duy nhất dùng component này là
`src/pages/dashboard/PageGeneralInformation.vue:153`
(`<GroupTags ... v-model="skillsGroup" ... />`). Với emit tên sai, `v-model`
KHÔNG BAO GIỜ nhận được update qua emit — trước đây code "hoạt động" chỉ
vì mutate trực tiếp prop (chính là bug của issue #10). Nếu chỉ bỏ mutation
mà KHÔNG sửa tên emit, `v-model` ở cha sẽ vĩnh viễn không đồng bộ nữa —
đúng bằng cách bỏ 1 bug lại tạo ra 1 bug khác. Sửa tên emit là điều kiện
cần để fix trong issue thực sự hoạt động, không phải scope creep.

`props.handleAction(newTags)` (gọi API PATCH thật) không phụ thuộc vào
`v-model` — nó nhận `newTags` trực tiếp làm tham số nên không bị ảnh hưởng
bởi bug/fix emit name.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.61s
```
Build xanh. Build-only evidence — không có test suite thật, không chạy
`npm run dev` để click qua UI (thêm/xoá tag) trong phiên này.

## Trạng thái
sealed_pending_verifier
