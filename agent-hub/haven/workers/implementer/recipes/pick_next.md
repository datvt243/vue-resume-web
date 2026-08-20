# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

## Steps
1. Đọc `NORTHSTAR.md` + `doctrine/MEMORY.md` + `doctrine/domains/PROJECT.md`.
2. Đọc MỌI diagram trong `haven/diagrams/`, lập danh sách node + PM status.
3. Tìm node PENDING sớm nhất trên critical path (hiện tại: `hub-init`, xem
   `dev-loop.prime-mermaid.md`).
4. Không match → không tự bịa việc; báo rõ "không có node PENDING", dừng.
5. Định vị code anchors bằng grep trong `../src/` — path thật, không tự
   bịa (vd `src/models/`, `src/composables/`, `src/services/`).
6. Khai báo blockers: nếu `doctrine/MEMORY.md` thiếu lệnh cần dùng, dừng và
   báo `blocked` — KHÔNG đoán lệnh.
7. Evidence: viết `evidence/implementer/<date>/<slug>-plan.md`.

## Hard rules honored
`NodeBeforeCode` | `EvidencePerAction` | `NoSilentFailure`

## Failure branches
| Failure | Handling |
|---|---|
| Chưa có diagram | Tạo `haven/diagrams/<slug>.prime-mermaid.md` khớp format `dev-loop` |
| Task mơ hồ | Dừng và hỏi, không đoán |
| Task đụng trap đã biết trong `doctrine/domains/PROJECT.md` (vd sửa `VeeForm.vue`, `auth.js`) | Đọc kỹ trap liên quan trước khi implement, tránh lặp lại pattern lỗi |

## Runtime
`/worker implementer "<task>"`. Không API key, không network call — Claude Code
LÀ runtime.
