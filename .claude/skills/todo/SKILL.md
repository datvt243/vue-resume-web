---
name: todo
description: "One-command version of the agent-hub implementer -> verifier loop for vue-resume-web. Usage: /todo \"<task>\". Runs implementer then verifier as two separate passes (verifier never carries the implementer's reasoning), auto-retries the implementer pass on REOPEN up to 3 times, then stops and reports. Does not auto-commit."
---

# /todo "<task>" — implementer → verifier, 2 lượt tách biệt, tự động

`args` là task nguyên văn. Nếu rỗng, dừng và hỏi lại.

Đây KHÔNG phải một pass tự viết tự chấm — chỉ gộp về mặt gõ lệnh. Bên trong
vẫn phải chạy đúng 2 lượt tách biệt như gọi `/worker` hai lần, và verifier
không được mang theo suy luận của lượt implementer (`NeverVerifyOwnWork`
không được phá vỡ).

## Loop
Đặt `N = 0`, `MAX = 3`.

1. **Lượt implementer** (nghĩa vụ như `/worker implementer "<task>"` — xem
   `.claude/skills/worker/SKILL.md`): pick_next → implement → `npm run
   build` + đọc lại output → evidence note → dừng ở
   `sealed_pending_verifier`.
   - Nếu implementer báo `blocked` (vd thiếu lệnh trong
     `doctrine/MEMORY.md`) → dừng NGAY, báo operator, KHÔNG lặp.
2. **Lượt verifier** (nghĩa vụ như `/worker verifier` — lượt hội thoại
   riêng về mặt suy luận, không mang theo lý luận vừa dùng ở bước 1): đọc
   evidence note của bước 1 → SEAL hoặc REOPEN.
3. Nếu **SEAL** → dừng vòng lặp, báo kết quả cho operator, trỏ tới evidence
   note implementer + verifier. KHÔNG tự `git add`/`commit`/`push` — seal
   gate vẫn áp dụng.
4. Nếu **REOPEN** → `N += 1`.
   - Nếu `N < MAX`: quay lại bước 1, kèm nguyên văn lý do REOPEN từ evidence
     note verifier làm input mới cho implementer.
   - Nếu `N >= MAX`: dừng, báo operator: node đang REOPEN liên tục, cần
     quyết định thủ công (không tự lặp vô hạn).

## Rules
- Seal gate áp dụng ở MỌI hành động outward-facing trong cả 2 lượt.
- Mọi lượt đều phải ghi evidence — không có ngoại lệ "gộp thì khỏi ghi".
- Nếu operator chỉ muốn tự đọc evidence giữa 2 bước trước khi cho verifier
  chấm, dùng `/worker implementer` + `/worker verifier` riêng thay vì
  `/todo`.
