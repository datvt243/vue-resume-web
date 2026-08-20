---
node: issue-14-useinittable-computed
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (issue-14-useinittable-computed) — OK, node có mặt
   trên diagram với state `IN_PROGRESS` trước khi verify.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/issue-14-useinittable-computed`. Tự chạy `git branch --show-current`
   độc lập → khớp chính xác. `git status --short` xác nhận repo đang đứng
   trên branch riêng đó, không có gì trên `main`. Pass.
3. `columns` không còn chờ `onMounted` mới có giá trị — tự đọc lại
   `src/composables/useInitTable.ts` độc lập: `columns` giờ là
   `computed<Columns[]>(() => [...toValue(settings)].map(...))`, không còn
   `onMounted`. `computed` tính giá trị ngay khi truy cập, không cần đợi
   lifecycle hook. Param `settings` đổi type từ `modelItem[]` →
   `MaybeRef<modelItem[]>`, khớp claim.
4. Reactive theo `settings` thay đổi — `toValue(settings)` đọc bên trong
   `computed`, Vue tự track dependency reactive nếu `settings` là `Ref`.
5. Call site có thực sự truyền `Ref` không (nếu không thì `computed` mới
   không có gì để track) — tự `grep -n "columns\|useInitTable\|toRef"
   src/components/table/TableDefault.vue` độc lập:
   `const { columns } = useInitTable(toRef(props.settings))` (dòng 26) —
   xác nhận `toRef(props.settings)` là `Ref` thật, không phải plain array.
6. `columns` chỉ được ĐỌC, không có chỗ nào gán lại `columns.value` (quan
   trọng vì `computed` là readonly, gán sẽ vỡ) — tự grep độc lập
   `TableDefault.vue`, chỉ thấy 1 lần dùng: `columns.value.filter(c =>
   c.field !== '_id')` (dòng 28, trong `getCols`). Không có `columns.value
   =` ở đâu trong file. Pass.
7. `npm run build` — tự chạy lại độc lập từ repo root (không tin nguyên văn
   note), output thật: `✓ 1339 modules transformed`, chỉ có warning
   chunk-size sẵn có (không liên quan đổi này), `✓ built in 4.82s`. Không
   lỗi. Build-only evidence, không phải test tự động thật (dự án không có
   test suite — khớp `doctrine/MEMORY.md`).
8. Tỷ lệ diff — tự chạy `git diff main --stat` độc lập:
   ```
    agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |  1 +
    src/composables/useInitTable.ts                    | 14 ++++++--------
    2 files changed, 7 insertions(+), 8 deletions(-)
   ```
   Đúng 1 file code (`src/composables/useInitTable.ts`) như claim, cộng
   dòng đăng ký node IN_PROGRESS trên diagram (bước bắt buộc trước khi
   chạm code, không phải scope creep). Không có file nào khác bị đổi.
9. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note (không `NO_EVIDENCE`), build đã
   tự verify lại độc lập (không `EDIT_UNVERIFIED`), không có code lẫn vào
   `haven/` (không `CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict
   này (không `DIAGRAM_DRIFT`), diff làm trên branch riêng
   `fix/issue-14-useinittable-computed`, không phải `main` (không
   `MAIN_EDIT`).
10. Seal gate — diff không chạm outward-facing (không commit/push/merge
    branch → main/`deploy.sh`/API thật) trong bước implementer này. Không
    cần approval ở bước này; merge về `main` là bước outward-facing riêng,
    sau này (`/ship`).
11. Output note không bị cắt/che theo nghĩa ẩn lỗi thật — output build
    trong note ngắn gọn (`...` chỉ lược asset-size noise), tự chạy build
    độc lập ở bước 7 xác nhận không có lỗi ẩn.

## Verdict
SEAL.
