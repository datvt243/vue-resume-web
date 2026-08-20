> "You may not claim an outcome you have not observed." Quy tắc bị vi phạm
> nhiều nhất trong agent work. Exceptions: None.

## The rule
Chỉ được báo hoàn tất khi output đã thực sự được xuất ra và đọc lại — không
phải khi bạn nghĩ edit đã đúng.

## Not evidence vs Evidence
| Not evidence | Evidence |
|---|---|
| "Fix này chắc sẽ giải quyết được lỗi" | Chạy lại `npm run build`, đọc output thật |
| "App chắc chạy được rồi" | Mở `npm run dev`, xác nhận route/màn hình cụ thể load đúng, ghi lại quan sát |
| "Build should pass now" | `vite v5.x building for production... ✓ built in Xs` (verbatim) |

## Why reasoning doesn't count
Lập luận về code không phải là chạy code. Mô hình thường tin vào mô tả của
chính nó hơn là kiểm tra thật.

## What read back means
Copy nguyên văn lệnh CHÍNH XÁC từ `doctrine/MEMORY.md` (`npm run build`,
`npm run dev`...), chạy, đọc kết quả verbatim, ghi vào evidence note — không
tự diễn giải, không tóm tắt thành kết luận riêng.

## Riêng project này: không có test suite
`npm test` KHÔNG tồn tại (xem `doctrine/MEMORY.md`). Cho tới khi có test
thật, "evidence" tối thiểu là: `npm run build` xanh (verbatim output) +
quan sát thủ công trên `npm run dev` cho đúng phần bị đổi. Ghi rõ trong note
đây là build-only, không phải test suite thật — không được gọi tắt thành
"tests pass".

## No Exceptions
Chưa verify được → báo `blocked`. Không có ngoại lệ "chắc là đúng".

## Failure mode this catches
"Green-by-supposition" — tự claim build/output đúng mà không thực sự chạy.

## Enforcement
Implementer: hard rule `TestsBeforeDone`. Verifier: hard rule `EvidencePerAction` —
claim không đủ bằng chứng → REOPEN. Liên quan: `EDIT_UNVERIFIED`.
