---
name: ship
description: "Commit any pending changes on the current task branch, merge it into main, and push — for vue-resume-web. Usage: /ship [\"<commit message>\"]. Refuses to run directly on main (MAIN_EDIT protection). Requires npm run build green first. Deletes fix/* branches after merge, keeps feature/* branches. Invoking /ship IS the seal-gate approval, no extra confirmation asked."
---

# /ship ["<commit message>"] — commit, merge branch → main, push

`args` (tuỳ chọn) là commit message. Nếu rỗng, tự suy ra từ diff hiện tại
theo Conventional Commits (`fix:`/`feat:`/`docs:`/`chore:`...), khớp style
lịch sử commit thật của repo (`git log --oneline`).

Gọi `/ship` LÀ approval cho hành động outward-facing này (Seal Gate, xem
`agent-hub/CLAUDE.md`) — không hỏi lại confirm thêm, trừ khi gặp vấn đề
chặn (build đỏ, đang đứng trên `main`, conflict...).

## Steps
1. `git branch --show-current`.
   - Là `main` + working tree sạch → báo "main sạch, không có gì để ship",
     dừng.
   - Là `main` + có thay đổi chưa commit → **TỪ CHỐI** ship trực tiếp trên
     `main` (`MAIN_EDIT`). Báo operator, đề xuất `git checkout -b <branch>`
     trước rồi gọi lại `/ship`.
2. Đang trên branch khác `main`:
   a. `npm run build` (đúng lệnh trong `agent-hub/doctrine/MEMORY.md`) —
      ĐỌC LẠI output nguyên văn. Đỏ → dừng ngay, KHÔNG commit/merge, báo
      lỗi thật cho operator.
   b. Nếu `git status --short` không rỗng: `git add` đúng các file liên
      quan tới thay đổi đang làm (không add rác/artifact ngoài ý), commit
      với message truyền vào hoặc tự suy luận, kèm dòng cuối
      `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
   c. `git checkout main && git merge --no-ff <branch> -m "Merge branch '<branch>' into main\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"`.
   d. `git push`.
   e. Xoá branch local tuỳ loại:
      - Branch tên bắt đầu `fix/...` (bugfix) → `git branch -d <branch>`
        (xoá — vòng đời branch fix kết thúc khi đã merge).
      - Branch tên bắt đầu `feature/...` (tính năng mới) → **GIỮ LẠI**,
        không xoá. Feature có thể còn cần tiếp tục làm thêm/rebase/tham
        chiếu sau merge.
      - Tên khác không khớp 2 pattern trên (vd `chore/...`, `docs/...`,
        `work/<node>`) → coi như fix-like, xoá sau merge (mặc định an
        toàn, ít branch rác).
3. Báo kết quả ngắn gọn: commit hash, branch đã merge, đã xoá hay giữ
   branch, push OK hay không — không lặp lại nội dung diff (đã có trong
   git log).

## Rules
- KHÔNG bao giờ merge/push nếu `npm run build` đỏ.
- KHÔNG force-push, KHÔNG `--no-verify`, KHÔNG bỏ qua hook.
- Repo đang merge conflict / rebase dở dang → dừng, báo operator, không tự
  `--abort`/`-X ours`.
- File trong `agent-hub/` nếu có trong diff vẫn add/commit bình thường,
  nhưng khi báo cáo ở bước 3 áp dụng quy tắc terse: chỉ nêu tên file, không
  show nội dung.
- `/ship` không tự chạy verifier. Nếu tên branch khớp pattern
  `fix/issue-<n>-...`/`work/<node>`, tra nhanh
  `agent-hub/haven/diagrams/*.md` — node liên quan chưa `SEALED` thì vẫn
  ship được (đây là lệnh git thuần) nhưng cảnh báo ngắn 1 dòng cho operator
  biết.

## Runtime
`/ship` hoặc `/ship "<commit message>"`.
