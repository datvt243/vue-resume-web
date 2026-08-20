---
node: issue-medium-batch-cleanup
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (`issue-medium-batch-cleanup`) — OK, node có mặt
   trên diagram với state `IN_PROGRESS` trước khi verify. Đây là deviation
   có chủ ý khỏi `SmallestDiff` per-issue (batch 8 issue MEDIUM theo yêu
   cầu trực tiếp operator, cùng pattern đã SEAL trước đó cho
   `issue-low-batch-cleanup`) — không REOPEN chỉ vì gộp nhiều issue, đúng
   như task đã ghi rõ.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/medium-severity-batch`. Tự chạy `git branch --show-current` độc
   lập → khớp chính xác (`fix/medium-severity-batch`), không phải `main`.
   Pass.
3. Build — tự chạy lại độc lập `npm run build` từ repo root (không tin
   nguyên văn note), output thật: `✓ 1339 modules transformed`, chunk-size
   warning sẵn có (không liên quan đổi này), `✓ built in 4.63s`. Không lỗi,
   không bị cắt/che. Build-only evidence, dự án không có test suite (khớp
   `doctrine/MEMORY.md`).
4. Tỷ lệ diff — tự chạy `git diff main --stat` độc lập: đúng 9 file code
   thay đổi (`auth.js`, `axios.js`, `useCandidate.ts`, `PageProject.vue`,
   `FrmCurrency.vue`, `model.type.ts`, `award.model.ts`, `PageAward.vue`,
   `PageCertificate.vue`) khớp 100% với bảng Diff trong note (9 dòng, 1 file
   `auth.js` gộp 2 issue #38/#39), cộng dòng PM status trên diagram. Không
   có file nào ngoài phạm vi 8 issue. Pass `SmallestDiff` cho một batch có
   chủ đích.
5. Per-issue check (đọc trực tiếp `git diff main -- <file>` trên file thật
   hiện tại, độc lập với prose của note):
   - **#38** `auth.js`: cả `logOut()` và `clearUser()` đổi
     `Object.assign(_user, {})` → `Object.keys(_user).forEach(key =>
     delete _user[key])`. Confirmed.
   - **#39** `auth.js`: `logOut()` gọi thêm `candidateStore().clean()`,
     `candidateStore` import ở đầu file (`import { candidateStore } from
     '@/stores/candidate'`). Grep độc lập xác nhận call site auto-logout:
     `src/services/axios.js:50` (`catch (refreshErr) { authStore().logOut()
     }`) và `src/services/base.js:110-111` (`if (invalidToken) { const store
     = authStore(); store?.logOut() }`) — cả hai đều đi qua `logOut()` này
     nên thừa hưởng fix. Confirmed.
   - **#40** `axios.js`: biến module-level `_refreshPromise`; nhánh 401
     dùng chung 1 promise (`if (!_refreshPromise) { _refreshPromise =
     axios.post(...).finally(() => _refreshPromise = null) }`) thay vì gọi
     `auth/refresh` riêng mỗi request. Confirmed.
   - **#41** `useCandidate.ts`: thêm `hasCachedData = Array.isArray(_result)
     ? _result.length > 0 : Object.keys(_result || {}).length > 0`, dùng
     thay `!_result.length`. Confirmed — xử lý đúng cả object-shaped field.
   - **#42** `PageProject.vue`: `edu.technology.join(', ')` →
     `edu.technology?.join(', ')`. Confirmed.
   - **#43** `FrmCurrency.vue`: `value.value = 0` vô điều kiện → bọc trong
     `if (value.value === undefined || value.value === null) { value.value
     = 0 }`. Confirmed.
   - **#44** `model.type.ts` (`defaultDate`): `valid` `yup.string()` →
     `yup.number()`, `default` `new Date('1990-01-01')` → `+new
     Date('1990-01-01')`. `award.model.ts` (`issueDate`): `valid`
     `yup.date()` → `yup.number()` (default vốn đã là `+new Date()`).
     Confirmed cả 2 file, khớp pattern numeric-timestamp của
     `defaultDateStartEnd`.
   - **#45** `PageAward.vue` + `PageCertificate.vue`: cả hai `handleDelete`
     đổi `deleteDoc({ ...doc }, 'school', ...)` → `'name'`. Confirmed cả 2
     file.
6. "Noticed, not done" trong note — đối chiếu độc lập:
   - `PageAward.vue:123` — `grep -n "school" PageAward.vue` xác nhận dòng
     `` `Chỉnh sửa: ${document.school}` `` vẫn còn nguyên, KHÔNG nằm trong
     diff (đúng như note khai — bug liên quan nhưng ngoài phạm vi #45 literal,
     không sửa để tránh scope creep). Confirmed không bị đụng tới.
   - `Header.vue` gọi trùng `clean()` sau khi `logOut()` đã tự clean — vô
     hại, không thuộc phạm vi, không kiểm sâu thêm (đúng như note ghi).
7. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note implementer (không
   `NO_EVIDENCE`), build đã tự verify lại độc lập (không `EDIT_UNVERIFIED`),
   không có code lẫn vào `haven/` (không `CODE_IN_HAVEN`), PM status cập
   nhật ngay sau verdict này (không `DIAGRAM_DRIFT`), diff làm trên branch
   riêng `fix/medium-severity-batch`, không phải `main` (không `MAIN_EDIT`).
8. Seal gate — diff không chạm outward-facing (không commit/push/merge
   branch → main/`deploy.sh`/API thật) ở bước implementer này. Không cần
   approval ở bước này; merge về `main` là bước outward-facing riêng qua
   `/ship`, sau này.

## Verdict
SEAL. Cả 8/8 issue (#38–#45) đều có evidence trích dẫn được từ diff thật
hiện tại (không chỉ tin prose của note), bao gồm inherited-fix claim của
#39 đã tự grep xác nhận cả 2 call site auto-logout. Build xanh tự verify
độc lập, branch đúng, không scope creep (`PageAward.vue:123` xác nhận vẫn
untouched).
