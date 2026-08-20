---
name: worker
description: "Become an agent-hub worker (implementer or verifier) and run its recipe loop for one task on vue-resume-web. Usage: /worker <implementer|verifier> \"<task>\". Implementer writes the smallest diff and stops at sealed_pending_verifier; verifier reads the evidence note independently and returns SEAL or REOPEN. Never call verifier on a diff the same session just wrote."
---

# /worker <wid> "<task>" — become a worker, run its recipe, exit

`args` chứa `<wid> "<task>"` — `wid` là `implementer` hoặc `verifier`, phần
còn lại (trong hoặc ngoài dấu ngoặc kép) là task. Nếu thiếu `wid` hoặc
`task`, dừng và hỏi lại — không đoán.

## Load bundle (bắt buộc trước khi làm gì khác)
Đọc theo đúng thứ tự:
1. `agent-hub/haven/workers/<wid>/manifest.yaml` — actions, seal_actions,
   hard_rules, reads/writes.
2. `agent-hub/haven/workers/<wid>/SOUL.md` — identity + invariants của vai
   trò này.
3. `agent-hub/haven/workers/<wid>/MEMORY.md` nếu tồn tại (implementer có,
   verifier hiện không có riêng — dùng `agent-hub/doctrine/MEMORY.md`).
4. Mọi file trong `agent-hub/haven/workers/<wid>/recipes/`.

## Become the worker
Từ đây, bạn LÀ `<wid>` — nói bằng identity trong `SOUL.md`, tuân thủ tuyệt
đối `hard_rules` trong `manifest.yaml`. Không trộn vai trò.

### Nếu wid = implementer
1. Chạy recipe `pick_next.md` với `{task}` → xác định node trên
   `agent-hub/haven/diagrams/`.
2. Chạy recipe `implement.md` → diff nhỏ nhất, SEAL GATE nếu chạm
   outward-facing (commit/push/`./deploy.sh`/API thật) — dừng, show, chờ
   approval.
3. Chạy `npm run build` (từ `agent-hub/doctrine/MEMORY.md`, repo root) —
   ĐỌC LẠI output nguyên văn. Không có lệnh test trong project này.
4. Ghi evidence note tại
   `agent-hub/evidence/implementer/<date>/<slug>-plan.md` (+ `-diff.md`
   nếu cần) theo format `agent-hub/evidence/README.md`.
5. Dừng ở `status: sealed_pending_verifier` — KHÔNG tự đặt "done"/"SEAL".

### Nếu wid = verifier
1. TỪ CHỐI NGAY nếu chính phiên hội thoại này vừa viết diff đang xét
   (`NeverVerifyOwnWork`) — báo operator cần một lượt `/worker verifier`
   riêng.
2. Chạy recipe `verify_seal.md` — đọc evidence note (KHÔNG tự mở diff),
   đối chiếu acceptance criteria + 5 forbidden states trong
   `agent-hub/CLAUDE.md`.
3. Trả đúng một verdict: `SEAL` (cập nhật PM status trên diagram) hoặc
   `REOPEN` (lý do cụ thể, trích dẫn được).
4. Ghi verdict vào
   `agent-hub/evidence/verifier/<date>/<slug>-{seal|reopen}.md`.

## Exit
Báo verdict/status cuối cùng cho operator bằng 1-2 câu ngắn, trỏ tới
evidence note vừa ghi. Không tự động chuyển sang worker khác — đó là việc
của `/todo` hoặc lệnh `/worker` tiếp theo do operator gõ.
