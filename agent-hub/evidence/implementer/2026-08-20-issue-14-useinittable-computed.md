---
node: issue-14-useinittable-computed
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #14](https://github.com/datvt243/vue-resume-web/issues/14) —
`src/composables/useInitTable.ts:19-34` dùng `onMounted` để set `columns`
→ table render rỗng trước khi mount (layout flash), và không reactive nếu
`settings` đổi sau đó. Đổi sang `computed`.

## Branch
`fix/issue-14-useinittable-computed` (checkout từ `main` trước khi đổi file
— đúng `BranchBeforeCode`).

## Diff
`src/composables/useInitTable.ts`: `onMounted(() => { columns.value = ... })`
→ `computed(() => [...toValue(settings)].map(...))`, đổi type param từ
`modelItem[]` → `MaybeRef<modelItem[]>` (khớp đúng cách fix đề xuất trong
issue #14, và khớp cách gọi thật trong `TableDefault.vue:26`:
`useInitTable(toRef(props.settings))` — đã truyền `Ref` từ trước, giờ mới
thực sự reactive).

Xác nhận `columns` chỉ được ĐỌC (`columns.value.filter(...)` ở
`TableDefault.vue:28`), không có chỗ nào gán lại `columns.value` — an toàn
khi đổi từ `ref` (writable) sang `computed` (readonly).

## Command
```
npm run build
```
(từ repo root, đúng lệnh trong `doctrine/MEMORY.md` — không có lệnh test).

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1339 modules transformed.
...
✓ built in 4.77s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| `columns` không còn chờ `onMounted` mới có giá trị | `computed` tính ngay khi truy cập, không cần đợi lifecycle hook |
| Reactive theo `settings` thay đổi | `toValue(settings)` bên trong `computed` — Vue tự track dependency |
| Không có chỗ nào gán `columns.value` bị vỡ (computed là readonly) | `grep "columns" TableDefault.vue` → chỉ đọc, không ghi |
| Build vẫn xanh | `✓ built in 4.77s` |

## Noticed, not done
Không có gì mới ngoài scope của #14 phát hiện trong lúc sửa.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
