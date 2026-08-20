> Đây là chỗ TÔI học được khi làm việc. Không phải ground truth của project
> (đó là `doctrine/domains/`), không phải rule của hub (đó là
> `doctrine/MEMORY.md`) — mà là craft riêng tôi tích trên codebase này.
> Append-only: sửa một entry khi nó hoá ra sai, đừng lặng lẽ bỏ nó đi.

## Always true for me
- Tôi đọc `doctrine/MEMORY.md` để lấy lệnh build CHÍNH XÁC mỗi phiên
  (`npm run build` từ repo root — không có lệnh test).
- Tôi chạy build từ repo root
  (`/Users/_david/Workspace/Project/ResumeAPI/frontend`) trừ khi
  `doctrine/MEMORY.md` nói khác.
- Khi build fail HAI LẦN cùng lý do, tôi dừng và đọc lại
  `doctrine/domains/PROJECT.md` trước khi thử lần ba — hai lần fail nghĩa
  là mô hình của tôi về project sai, không phải code sai.
- `package.json` có CẢ `package-lock.json` lẫn `yarn.lock` — tôi dùng npm,
  không chạy `yarn install` trừ khi task yêu cầu rõ ràng dọn lockfile.

## Patterns that work here
- Section dữ liệu mới (education-like) → tạo `models/*.model.ts` trước, rồi
  ghép `useCandidate` + `useDocument` + `VeeForm` — đây là pattern lặp lại
  xuyên suốt `src/pages/dashboard/`.
- Component trong `src/components/global/` không cần import — tự động qua
  `GlobalComponents.js`; đừng thêm `import` thừa cho chúng.

## Recipes I've earned
| Recipe | Written | Times replayed |
|---|---|---|
| pick_next | 2026-08-20 | 7 |
| implement | 2026-08-20 | 7 |

## Corrections
| Date | I believed | Actually |
|---|---|---|
| 2026-08-20 | `deploy.sh` push qua SSH sẽ chạy được trong môi trường này | Sandbox này không có `~/.ssh` (không key, không known_hosts) — SSH push fail `Host key verification failed`. Workaround (đã được operator duyệt): push thủ công qua HTTPS `git push -f https://github.com/datvt243/vue-resume-web.git master:gh-pages` từ `dist/`, dùng credential helper `osxkeychain` mà `gh auth login` đã set sẵn. Không tự sửa `deploy.sh` — đó là quyết định lâu dài cần operator. **CẬP NHẬT (issue #16, cùng ngày):** `deploy.sh` đã bị XOÁ hẳn, thay bằng `.github/workflows/deploy.yml` (GitHub Actions, tự deploy khi push `main`) — entry này giữ lại làm lịch sử, không còn áp dụng được nữa vì file không còn tồn tại. |
