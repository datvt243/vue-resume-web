---
node: issue-34-converttotruncate-length
worker: implementer
date: 2026-08-20
---

## Task
Deploy sealed fix cho [issue #34](https://github.com/datvt243/vue-resume-web/issues/34)
lên GitHub Pages theo yêu cầu operator ("chạy deploy.sh cho các fix vừa rồi").

## Seal gate
Outward-facing (publish qua GitHub Pages). Operator yêu cầu trực tiếp chạy
`deploy.sh` → approval có. Khi `deploy.sh` fail do thiếu SSH key trong môi
trường này, đã hỏi lại operator cách xử lý qua `AskUserQuestion` trước khi
đổi cách push — operator chọn "push tạm qua HTTPS bằng token gh hiện có".

## Diff / Command
1. `./deploy.sh` — chạy `npm run build` (xanh, `✓ built in 4.70s`), sau đó
   `git init && git add -A && git commit -m 'deploy'` trong `dist/` — OK.
2. Bước cuối của `deploy.sh` (`git push -f git@github.com:...`) FAIL:
   ```
   Host key verification failed.
   fatal: Could not read from remote repository.
   ```
   Nguyên nhân: không có `~/.ssh` (không key, không known_hosts) trong môi
   trường này.
3. Thay vì sửa `deploy.sh`, chạy thủ công đúng 1 lệnh tương đương nhưng qua
   HTTPS (dùng credential helper `osxkeychain` mà `gh auth login` đã thiết
   lập sẵn), từ trong `dist/`:
   ```
   git push -f https://github.com/datvt243/vue-resume-web.git master:gh-pages
   ```

## Output (đọc lại nguyên văn)
```
To https://github.com/datvt243/vue-resume-web.git
 + 193c927...78166d7 master -> gh-pages (forced update)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Build cho deploy xanh | `✓ built in 4.70s` |
| gh-pages branch nhận đúng commit build mới | `193c927...78166d7 master -> gh-pages (forced update)` |
| Seal gate được tôn trọng trước khi publish | Operator yêu cầu trực tiếp + được hỏi lại khi cần đổi cách push |

## Noticed, not done
`deploy.sh` hardcode remote SSH — không chạy được trong môi trường sandbox
không có SSH key. Không sửa `deploy.sh` (ngoài scope task này, và sửa cơ
chế deploy cần operator quyết định lâu dài — SSH vs HTTPS). Đã ghi correction
vào `haven/workers/implementer/MEMORY.md` để phiên implementer sau biết
trước, tránh mất thời gian dò lại.

## Trạng thái
Deployed. Không phải node mới trên diagram (đây là hành động publish, không
phải thay đổi code cần verify lại) — node `issue-34-converttotruncate-length`
giữ nguyên SEALED.
