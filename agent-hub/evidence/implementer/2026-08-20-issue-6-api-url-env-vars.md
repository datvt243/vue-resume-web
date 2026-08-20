---
node: issue-6-api-url-env-vars
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #6](https://github.com/datvt243/vue-resume-web/issues/6) —
`src/config/api.config.js` hardcode logic `host === 'localhost' ? ... :
'https://nodejs-resume-api-ts.onrender.com/'` — không tách config khỏi
code (12-Factor App, Factor III), không thể có staging env, không config
được cho fork khác.

## Branch
`fix/issue-6-api-url-env-vars` (checkout từ `main` trước khi đổi file —
đúng `BranchBeforeCode`).

## Quyết định khác với ví dụ trong issue (có lý do)
Issue đề xuất gộp cả host lẫn `api/v1/` vào 1 biến
`VITE_API_URL=http://localhost:3001/api/v1/`. Kiểm tra trước khi làm theo
y nguyên: `src/pages/_layouts/Header.vue` có endpoint
`${host}api/me/${email}` — KHÔNG đi qua tiền tố `api/v1/` (khác
`getFile()` cùng file, có `api/v1/download-pdf`). Nếu gộp `api/v1/` vào
`VITE_API_URL` như ví dụ, `getMe()` sẽ build sai URL thành
`.../api/v1/api/me/...`.

→ Quyết định: `VITE_API_URL` chỉ chứa bare host (khớp đúng semantics của
`API` cũ), giữ `subURL = 'api/v1/'` như hằng số riêng trong
`api.config.js` (không phải secret, không đổi theo môi trường — chỉ là
path segment cố định). Vẫn đạt đúng mục tiêu chính của issue: URL backend
thật (thứ THẬT SỰ đổi theo môi trường) không còn hardcode trong
`.js`/logic điều kiện `window.location.hostname`, mà đọc từ `.env.*`.

## Diff
| File | Why |
|---|---|
| `.env.development` (mới) | `VITE_API_URL=http://localhost:3001/` |
| `.env.production` (mới) | `VITE_API_URL=https://nodejs-resume-api-ts.onrender.com/` |
| `src/config/api.config.js` | `export const API = import.meta.env.VITE_API_URL` (bỏ hẳn logic `window.location.hostname === 'localhost' ? ... : ...`); `subURL` giữ nguyên |
| `.gitignore` | KHÔNG sửa — đã có sẵn `*.local` che `.env.*.local` (verified: `git check-ignore -v .env.production.local` → khớp rule `*.local`), bước 4 trong issue coi như đã đáp ứng từ trước |

KHÔNG sửa `axios.ts`/`auth.ts`/`base.ts`/`Header.vue` — tên export `API`/
`subURL` giữ nguyên 100%, chỉ đổi CÁCH `API` được tính ra, nên mọi call
site hiện có tự động hoạt động đúng mà không cần sửa gì thêm (đã verify
bằng cách chạy build + dev, xem output bên dưới).

## Command
```
npm run build
npm run lint
npm run dev   # + curl kiểm tra thủ công, không phải test tự động
```

## Output (đọc lại nguyên văn)

`npm run build`:
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.67s
```

Kiểm tra bundle production thật sự inline đúng giá trị từ `.env.production`:
```
$ grep -o "onrender.com[^\"']*" dist/assets/*.js | head -3
dist/assets/index-_zg9pd-w.js:onrender.com/
```

`npm run lint`:
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```

`npm run dev` + curl thủ công, xác nhận dev server đọc đúng
`.env.development` (KHÔNG phải suy luận — đọc thẳng response thật của Vite
dev server):
```
$ curl -s http://localhost:5173/vue-resume-web/src/config/api.config.js
import.meta.env = {"VITE_API_URL": "http://localhost:3001/", "BASE_URL": "/vue-resume-web/", "MODE": "development", "DEV": true, ...};
export const API = import.meta.env.VITE_API_URL
export const subURL = 'api/v1/'
```

## Acceptance
| Criterion | Evidence |
|---|---|
| URL backend không còn hardcode trong logic điều kiện JS | `api.config.js` giờ chỉ đọc `import.meta.env.VITE_API_URL`, không còn `window.location.hostname === 'localhost' ? ... : ...` |
| Dev mode dùng đúng `.env.development` | curl output ở trên: `VITE_API_URL: "http://localhost:3001/"` |
| Production build dùng đúng `.env.production` | `grep` trực tiếp trong `dist/assets/*.js` tìm thấy `onrender.com/` |
| `.env.*.local` đã được gitignore | `git check-ignore -v .env.production.local` → khớp `*.local` (đã có sẵn, verified trước khi claim "không cần sửa") |
| Build/lint vẫn xanh | `✓ built in 4.67s`, lint exit 0 |
| Không sửa call site nào ngoài `api.config.js` (SmallestDiff) | `git diff --stat` chỉ có `.env.development`, `.env.production`, `src/config/api.config.js` |

## Noticed, not done
- Không gộp `subURL` vào `VITE_API_URL` như ví dụ nguyên văn trong issue —
  xem phần "Quyết định khác với ví dụ" ở trên, lý do: sẽ phá endpoint
  `api/me/` trong `Header.vue` vốn không đi qua `api/v1/`.
- `.env.production` commit thẳng vào git (đúng như issue tự đề xuất ở
  Bước 1) — URL production (`nodejs-resume-api-ts.onrender.com`) vẫn nằm
  trong repo, chỉ chuyển từ file `.js` sang file `.env.production`. Đây là
  domain public (ai cũng gọi được), không phải secret — đúng tinh thần
  ví dụ gốc trong issue, không phải thiếu sót.
- Không động tới `Header.vue`'s hardcoded `window.location.host ===
  'localhost' ? 'http://localhost:3001/' : API` (dòng riêng, độc lập với
  `api.config.js`) — vẫn còn 1 chỗ kiểm tra hostname runtime tương tự
  logic cũ, nhưng đây là code khác file, không thuộc phạm vi trực tiếp
  issue #6 (issue chỉ trích dẫn `api.config.js`). Có thể cần dọn thêm nếu
  operator muốn triệt để 100%, nhưng ngoài phạm vi diff nhỏ nhất cho task
  này.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier

## Correction (sau SEAL lần 1)
Verifier phát hiện: `.env.production` KHÔNG phải file mới — đã tồn tại
trên `main` với nội dung `BASE_URL=/vue-resume-web/`, và tôi đã ghi đè mất
dòng đó khi tạo file (bảng Diff ở trên ghi sai "mới" cho file này). Verifier
xác nhận không phải regression chức năng thật (`vite.config.ts` không gọi
`loadEnv()` nên `process.env.BASE_URL` không bao giờ đọc được từ file
`.env` qua cơ chế Vite tiêu chuẩn — biến `base` trong `vite.config.ts`
thực chất là dead code, `base:` được hardcode thẳng `/vue-resume-web/`),
nhưng đây vẫn là thay đổi ngoài ý định, vi phạm tinh thần SmallestDiff.

Fix: viết lại `.env.production` giữ CẢ 2 dòng:
```
BASE_URL=/vue-resume-web/
VITE_API_URL=https://nodejs-resume-api-ts.onrender.com/
```
Chạy lại `npm run build` — vẫn `✓ built in 4.80s`, `grep -o
"onrender.com[^\"']*" dist/assets/*.js` vẫn tìm thấy đúng URL. Không có gì
đổi về hành vi, chỉ khôi phục dòng bị mất.

`git diff main --stat` giờ đúng: `.env.development` (mới thật),
`.env.production` (SỬA, không phải mới), `src/config/api.config.js` (sửa).

Trạng thái vẫn: sealed_pending_verifier (cần lượt verifier MỚI xác nhận
lại phần đã sửa, không phải lượt vừa SEAL).
