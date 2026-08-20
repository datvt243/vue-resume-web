---
node: issue-low-batch-cleanup
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (`issue-low-batch-cleanup`) — OK, node có mặt trên
   diagram với state `IN_PROGRESS` trước khi verify. Đây là deviation có
   chủ ý khỏi `SmallestDiff` per-issue (batch 9 issue LOW theo yêu cầu trực
   tiếp operator) — không REOPEN chỉ vì gộp nhiều issue, đúng như task đã
   ghi rõ.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/low-severity-batch`. Tự chạy `git branch --show-current` độc lập →
   khớp chính xác (`fix/low-severity-batch`). `git status` xác nhận đang
   đứng trên branch riêng, không phải `main`. Pass.
3. Build — tự chạy lại độc lập `npm run build` từ repo root (không tin
   nguyên văn note), output thật: `✓ 1339 modules transformed`, chunk-size
   warning sẵn có (không liên quan đổi này), `✓ built in 4.63s`. Không lỗi.
   Build-only evidence, dự án không có test suite (khớp
   `doctrine/MEMORY.md`).
4. Tỷ lệ diff — tự chạy `git diff main --stat` độc lập: đúng 10 file code
   thay đổi (9 file sửa + 1 rename `generalInformation.modal.ts` →
   `.model.ts`) khớp 100% với bảng Diff trong note, cộng thêm dòng PM
   status trên diagram (do implementer thêm khi mở node, không phải code).
   Không có file nào ngoài phạm vi 9 issue. Pass `SmallestDiff` cho một
   batch có chủ đích.
5. Per-issue check (đọc trực tiếp file thật hiện tại, độc lập với prose
   của note):
   - **#46** `Dropdown.vue`: `attrBtnToggle` computed không còn key
     `ref: 'refDropdown'`; thẻ `<a>` có `ref="refDropdown"` literal
     (dòng 38). Confirmed.
   - **#47** `FrmArray.vue`: dòng 8 import `FieldArray, Field` từ
     `vee-validate`; template dùng `:name="props.name"` ở cả
     `<FieldArray>` (dòng 43) và `<Field>` con (dòng 45), không còn
     hardcode `"links"`. Confirmed.
   - **#48** `FrmCheckbox.vue`: input có `:value="checkedValue"` (bound,
     dòng 46), không còn literal string `value="checkedValue"`. Confirmed.
   - **#49** `regex.config.js`: `phoneRegex` = `^(84|0)(3|5|7|8|9)[0-9]{8}$`
     — không còn `+` quantifier bọc alternation. Confirmed.
   - **#50** `LayoutDefault.vue` + `LayoutAuth.vue`: `git diff main` cho cả
     2 file xác nhận `Header(:is-login="true")` → `Header` và
     `Header(:is-login="false")` → `Header`, không còn prop nào truyền.
     Confirmed cả 2 file.
   - **#51** `LayoutDefault.vue`: `git diff main` xác nhận
     `r.to === $route.fullPath` → `r.to === $route.path`, khớp
     `getRouterName($route.path)` dùng ngay phía trên. Confirmed.
   - **#52** `ls src/models/` → `generalInformation.model.ts` tồn tại,
     `generalInformation.modal.ts` không còn. `PageGeneralInformation.vue`
     dòng 30 import `@/models/generalInformation.model`. Tự chạy
     `grep -rn "generalInformation.modal" src/` độc lập → 0 kết quả.
     Confirmed.
   - **#53** `experience.model.ts`: `git diff main` xác nhận field `_id`
     object tự viết tay (`yup.mixed()...`) bị xoá, thay bằng `defaultId`
     (import từ `@/types/model.type`, dòng 8) đặt ở đầu mảng MODEL.
     Confirmed.
   - **#54** `certificate.model.ts`: cả `name` (dòng 19) và `organization`
     (dòng 27) đều có `.trim()` trong chuỗi validator
     (`yup.string().trim().max(...)`). Confirmed.
6. "Noticed, not done" trong note (dead code có sẵn trong
   `experience.model.ts`, `certificate.model.ts`, `FrmArray.vue` không
   được dùng ở đâu) — đối chiếu với `git diff main --stat` ở bước 4: đúng
   là các file đó không bị dọn thêm gì ngoài phạm vi issue tương ứng.
   Không phải scope creep, không REOPEN.
7. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note implementer (không
   `NO_EVIDENCE`), build đã tự verify lại độc lập (không
   `EDIT_UNVERIFIED`), không có code lẫn vào `haven/` (không
   `CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict này (không
   `DIAGRAM_DRIFT`), diff làm trên branch riêng `fix/low-severity-batch`,
   không phải `main` (không `MAIN_EDIT`).
8. Seal gate — diff không chạm outward-facing (không commit/push/merge
   branch → main/`deploy.sh`/API thật) ở bước implementer này. Không cần
   approval ở bước này; merge về `main` là bước outward-facing riêng qua
   `/ship`, sau này.

## Verdict
SEAL. Cả 9/9 issue (#46–#54) đều có evidence trích dẫn được từ file thật
hiện tại (không chỉ tin prose của note), build xanh tự verify độc lập,
branch đúng, không scope creep.
