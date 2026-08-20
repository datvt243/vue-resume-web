> Đây là recipe chạm code nhiều nhất — chỗ `EDIT_UNVERIFIED` bị bắt hoặc lọt qua.

# Contract
- Input: output của `pick_next`.
- Output: `{status: sealed_pending_verifier | reopened_by_test | failed, node,
  diff summary, command, evidence}`
- NEVER: `status: done` — chỉ verifier mới dùng trạng thái đã seal.

## Steps
0. KIỂM TRA BRANCH TRƯỚC TIÊN — `git status`/`git branch --show-current`.
   Nếu đang ở `main`: `git checkout -b <branch>` TRƯỚC KHI đổi bất kỳ file
   nào — đặt tên theo LOẠI task (xem `doctrine/MEMORY.md` → Git workflow):
   bugfix → `fix/issue-<n>-<slug>` (vd
   `fix/issue-34-converttotruncate-length`); tính năng mới →
   `feature/<slug>`; việc khác → `chore/<slug>`/`docs/<slug>`. Prefix này
   quyết định `/ship` có xoá branch sau merge hay không (`fix/*` xoá,
   `feature/*` giữ lại).
   Nếu `main` đã có thay đổi chưa commit từ trước (không phải do tôi) →
   dừng, báo `MAIN_EDIT`, hỏi operator (đừng tự `stash`/`checkout` đè lên
   việc dang dở của người khác).
1. Đọc lại node + acceptance criteria.
2. Đọc mọi file liên quan trước khi viết — khớp naming/style/idiom hiện có
   trong `src/` (vd `<script setup>`, composables pattern, model-driven
   forms — xem `doctrine/domains/PROJECT.md`).
3. Smallest diff — chỉ đổi cái acceptance criteria đòi hỏi. Không tiện tay
   fix thêm trap khác chưa được giao.
4. SEAL GATE trước hành động outward-facing (commit, push, merge branch
   → `main`, `./deploy.sh`, gọi API thật) — dừng, show diff + tên branch,
   đợi approval.
5. Chạy CHÍNH XÁC `npm run build` từ `doctrine/MEMORY.md` — copy nguyên
   văn, chạy từ repo root. (Không có lệnh test — xem `MEMORY.md`.)
6. ĐỌC OUTPUT LẠI nguyên văn — claim không trích dẫn được = `EDIT_UNVERIFIED`.
7. Nếu diff động tới UI/route, xác nhận thêm bằng `npm run dev` + quan sát
   thủ công màn hình liên quan; ghi rõ đây là quan sát thủ công, không phải
   test tự động.
8. Chỉ báo `sealed_pending_verifier` khi TẤT CẢ criteria pass có evidence.
9. Nếu gặp bug/trap mới ngoài scope, ghi vào "Noticed, not done" trong
   evidence note — không tự sửa.
10. Ghi vào `evidence/` theo format ở `evidence/README.md` — PHẢI có dòng
    ghi tên branch đã dùng ở bước 0.

## Hard rules honored
`SmallestDiff` | `TestsBeforeDone` | `EvidencePerAction` | `NoSilentFailure` |
`NodeBeforeCode` | `BranchBeforeCode`

## Failure branches
| Failure | Handling |
|---|---|
| Thiếu lệnh trong `doctrine/MEMORY.md` | `blocked`, gợi ý điền `<<FILL>>` |
| Lỗi do thiếu setup (env, deps) | Báo lỗi THẬT, không vòng qua |
| `npm run build` fail do lỗi TypeScript trong file `.ts` bị đổi | Đọc lỗi verbatim, sửa đúng lỗi đó, build lại — không nới lỏng `tsconfig.json` để né lỗi |
| Đang ở `main` khi bắt đầu implement | Checkout branch mới TRƯỚC — không viết diff nào trên `main` (`MAIN_EDIT`) |

## Runtime
`/worker implementer "<task>"`.
