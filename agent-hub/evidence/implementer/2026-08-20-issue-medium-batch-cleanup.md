---
node: issue-medium-batch-cleanup
worker: implementer
date: 2026-08-20
---

## Task
Operator: "fix the MEDIUM issues next, gộp 1 commit" — fix toàn bộ 8 issue
MEDIUM severity đã tạo trước đó (#38-#45), gộp thành 1 diff/1 commit thay
vì 8 node riêng lẻ (deviation có chủ ý khỏi `SmallestDiff` per-issue, theo
yêu cầu trực tiếp của operator — cùng pattern đã dùng cho batch LOW
`issue-low-batch-cleanup`).

## Branch
`fix/medium-severity-batch` (checkout từ `main` trước khi đổi file — đúng
`BranchBeforeCode`).

## Diff
| File | Issue | Why |
|---|---|---|
| `src/stores/auth.js` | [#38](https://github.com/datvt243/vue-resume-web/issues/38), [#39](https://github.com/datvt243/vue-resume-web/issues/39) | `Object.assign(_user, {})` → `Object.keys(_user).forEach(key => delete _user[key])` ở cả `logOut()` và `clearUser()` (xóa được key cũ thật sự). `logOut()` gọi thêm `candidateStore().clean()` — fix luôn #39 vì mọi auto-logout (`axios.js` refresh fail, `base.js` invalidToken) đều đi qua `logOut()` này, không cần sửa riêng 2 chỗ đó. |
| `src/services/axios.js` | [#40](https://github.com/datvt243/vue-resume-web/issues/40) | Thêm `_refreshPromise` dùng chung — nhiều request 401 đồng thời chỉ gọi `auth/refresh` một lần thay vì mỗi request tự refresh riêng. |
| `src/composables/useCandidate.ts` | [#41](https://github.com/datvt243/vue-resume-web/issues/41) | `!_result.length` → `hasCachedData` kiểm cả trường hợp `_result` là object (field `generalInformation`), không còn luôn fetch lại API. |
| `src/pages/dashboard/PageProject.vue` | [#42](https://github.com/datvt243/vue-resume-web/issues/42) | `edu.technology.join(', ')` → `edu.technology?.join(', ')`. |
| `src/components/veevalidate/part/FrmCurrency.vue` | [#43](https://github.com/datvt243/vue-resume-web/issues/43) | `value.value = 0` vô điều kiện → chỉ set khi `value.value` là `undefined`/`null` (không ghi đè giá trị đã load). |
| `src/types/model.type.ts` | [#44](https://github.com/datvt243/vue-resume-web/issues/44) | `defaultDate` (dùng cho `birthday`): `valid` đổi `yup.string()` → `yup.number()`, `default` đổi `Date` object → `+new Date(...)` (number timestamp), khớp pattern mọi field ngày khác. |
| `src/models/award.model.ts` | [#44](https://github.com/datvt243/vue-resume-web/issues/44) | `issueDate`: `valid` đổi `yup.date()` → `yup.number()`, khớp pattern các field ngày khác (default đã là number từ trước). |
| `src/pages/dashboard/PageAward.vue` | [#45](https://github.com/datvt243/vue-resume-web/issues/45) | `handleDelete`: `deleteDoc({...doc}, 'school', ...)` → `'name'` (Award model không có field `school`, chỉ có `name`). |
| `src/pages/dashboard/PageCertificate.vue` | [#45](https://github.com/datvt243/vue-resume-web/issues/45) | `handleDelete`: cùng fix `'school'` → `'name'` (Certificate model cũng không có `school`). |

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
✓ built in 4.68s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| Cả 8 issue MEDIUM đều có diff tương ứng | Bảng Diff ở trên, mỗi dòng trỏ đúng 1 issue |
| Build vẫn xanh sau khi đổi cả 8 chỗ (9 file) | `✓ built in 4.68s` |
| `logOut()` xóa được key cũ khỏi `_user` reactive | `Object.keys(_user).forEach(key => delete _user[key])` thay vì `Object.assign(_user, {})` |
| Auto-logout (401/refresh fail) giờ clear cả candidateStore | `candidateStore().clean()` nằm trong `logOut()`, mọi call site tự động thừa hưởng |
| Refresh-token request không còn gọi trùng khi nhiều request 401 cùng lúc | `_refreshPromise` dùng chung, `.finally()` reset về `null` sau khi xong |

## Noticed, not done
- `src/pages/dashboard/PageAward.vue:123` — modal title dùng
  `document.school` (`Chỉnh sửa: ${document.school}`) nhưng Award model
  không có field `school` (chỉ có `name`) — cùng gốc bug với #45 nhưng
  KHÔNG nằm trong phạm vi được nêu ở issue #45 (issue chỉ nói về
  `handleDelete`). Không tự sửa — cần issue riêng nếu muốn fix.
- `src/pages/_layouts/Header.vue` gọi cả `store.logOut({ router })` lẫn
  `candidate.clean()` thủ công khi logout — giờ dư thừa (vì `logOut()` đã tự
  `clean()`) nhưng vô hại (idempotent). Không tự dọn vì không thuộc phạm vi
  #38/#39.
- Các import chết có sẵn từ trước (`formatDateToInput` không dùng trong
  `model.type.ts` và `award.model.ts`) — dead code trước khi tôi sửa, không
  thuộc phạm vi 8 issue MEDIUM này.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
