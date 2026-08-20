> Evidence is ai đã làm gì và tại sao (`NO_EVIDENCE` nếu thiếu). Mọi worker
> action kết thúc bằng một note.

## Layout
```
evidence/implementer/<date>/<slug>-plan.md
evidence/implementer/<date>/<slug>-diff.md
evidence/verifier/<date>/<slug>-{seal|reopen}.md
```
Ngày dạng `YYYY-mm-dd`, slug kebab-case lấy từ tên task.

## Format — implementer note
- Tiêu đề (ngày - node) · Worker · Version · Node (trỏ diagram) · Task
  (nguyên văn prompt)
- `## Diff` — files | file | why |
- `## Command` — lệnh nguyên văn từ `doctrine/MEMORY.md` (vd `npm run
  build` từ repo root — dự án này không có lệnh test riêng)
- `## Output` — nguyên văn, không tự diễn giải
- `## Acceptance` — bảng | Criterion | Evidence | (evidence trỏ tới dòng
  output cụ thể — không nói suông "build pass", phải trích verbatim vd
  `✓ built in 3.21s`)
- `## Noticed, not done` — điều nhận thấy ngoài scope nhưng không tự sửa
  (vd một trap khác trong `doctrine/domains/PROJECT.md` chưa được giao)
- `## Seal gate` — ghi approval nếu có hành động outward-facing
  (commit/push/`./deploy.sh`), hoặc "none"

## Format — verifier verdict
- Worker · Node · PM status mới (PENDING/SEALED/REOPEN)
- `## Reasoning` — trích dẫn evidence cho từng criterion
- `## Missing` — chỉ có khi REOPEN

## The three rules of this directory
1. **VERBATIM, ALWAYS** — không claim gì thiếu evidence trích dẫn thật.
2. **KHÔNG BAO GIỜ XOÁ** — note sai thì thêm correction, không xoá.
3. **BAD NOTES STAY** — note "task thất bại" vẫn giữ lại; giữ trail sạch
   không quan trọng bằng giữ giá trị của doctrine.

## Trạng thái hiện tại
Chưa có note nào — hub vừa được khởi tạo (2026-08-20). Note đầu tiên sẽ
xuất hiện khi `/worker implementer "<task>"` chạy thật lần đầu.
