---
node: issue-13-js-to-ts-migration
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #13](https://github.com/datvt243/vue-resume-web/issues/13) —
migrate 8 file `.js` → `.ts` theo đúng danh sách + thứ tự đề xuất trong
issue (bắt đầu từ file ít dependency nhất).

## Branch
`fix/issue-13-js-to-ts-migration` (checkout từ `main` trước khi đổi file —
đúng `BranchBeforeCode`).

## Chẩn đoán trước khi đổi
`grep` toàn bộ `src/`, `index.html`, `vite.config.ts` tìm import tường
minh (có đuôi `.js`) tới 8 file mục tiêu → chỉ tìm thấy đúng 2 chỗ:
- `index.html:16` — `<script type="module" src="/src/main.js">` (entry
  point HTML, bắt buộc phải sửa theo tên file mới).
- `src/App.vue:21` — `import { handleBase } from '@/services/base.js'`
  (import tường minh đuôi `.js`, các import khác trong dự án đều không ghi
  đuôi và tự resolve qua alias `@` nên không cần sửa).

## Diff
| Diễn giải | Cách làm |
|---|---|
| `src/composables/useHelper.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/routers/index.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/stores/auth.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/stores/candidate.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/services/axios.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/services/base.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/services/auth.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `src/main.js` → `.ts` | `git mv`, giữ nguyên nội dung |
| `index.html` | `/src/main.js` → `/src/main.ts` |
| `src/App.vue` | `from '@/services/base.js'` → `from '@/services/base'` (bỏ đuôi, khớp convention import không ghi đuôi của các import khác trong file) |

KHÔNG thêm type annotation mới cho bất kỳ file nào — issue #13 chỉ yêu cầu
đổi đuôi file để nhất quán (bảng "Cách migrate" trong issue chỉ liệt kê
rename, không yêu cầu viết lại type). Thêm type annotation đầy đủ là việc
lớn hơn nhiều, ngoài phạm vi diff nhỏ nhất cho task này — nếu operator
muốn, cần task riêng.

## Command
```
npm run build
npm run lint
npm run dev   # kiểm tra thủ công qua curl, không phải test tự động
```

## Output (đọc lại nguyên văn)

`npm run build`:
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1339 modules transformed.
...
✓ built in 5.09s
```

`npm run lint`:
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```

`npm run dev` + kiểm tra thủ công (curl, quan sát output — KHÔNG phải test
runtime tự động, chỉ xác nhận Vite serve/transform đúng entry point mới):
```
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/vue-resume-web/
200
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/vue-resume-web/src/main.ts
200
$ curl -s http://localhost:5173/vue-resume-web/src/main.ts | head -10
import { createApp } from "/vue-resume-web/node_modules/.vite/deps/vue.js?...";
import { createPinia } from "/vue-resume-web/node_modules/.vite/deps/pinia.js?...";
import router from "/vue-resume-web/src/routers/index.ts";
import App from "/vue-resume-web/src/App.vue";
...
```
Xác nhận Vite dev server transform đúng `main.ts` (entry point mới), resolve
đúng `router` → `src/routers/index.ts` (đường dẫn không đuôi tự tìm ra file
`.ts` mới, không cần sửa import chỗ khác).

## Acceptance
| Criterion | Evidence |
|---|---|
| Cả 8 file đã đổi đuôi `.js` → `.ts`, nội dung giữ nguyên | `git mv` (rename detection, không phải xoá+tạo mới) |
| Không còn tham chiếu `.js` nào bị vỡ tới 8 file đã đổi | `grep` trước khi sửa chỉ ra đúng 2 chỗ, cả 2 đã sửa |
| Build vẫn xanh | `✓ built in 5.09s` |
| Lint vẫn sạch (0 lỗi) sau khi đổi đuôi | exit 0, không output |
| Dev server thật sự serve được entry point mới | `curl` trả `200` cho cả `/` và `/src/main.ts`, nội dung transform đúng |

## Noticed, not done
- Không thêm type annotation/interface mới cho logic bên trong 8 file này
  — ngoài scope của issue #13 (chỉ yêu cầu rename để nhất quán, không yêu
  cầu viết type đầy đủ).
- `tsconfig.json` có `"strict": true` nhưng KHÔNG có script `tsc`/`vue-tsc`
  nào chạy thật trong dự án (đã ghi trong `doctrine/MEMORY.md` từ trước) —
  nên `strict` hiện chưa được enforce ở bất kỳ đâu, kể cả sau migration
  này. Nếu sau này có CI thêm bước typecheck thật (vd cùng lúc với issue
  #16/#20), rất có thể sẽ lộ ra nhiều lỗi type ẩn trong các file vừa đổi
  đuôi (đặc biệt các file dùng nhiều `any` ngầm định) — không thuộc phạm
  vi task này để fix trước.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
