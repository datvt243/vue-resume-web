---
node: register-auth-redirect-guard
worker: implementer
date: 2026-08-22
---

## Task
Bug tự phát hiện trong lúc test thủ công UI login/register bằng tài khoản
thật (không phải GitHub issue có sẵn) — operator yêu cầu "fix luôn đi, qua
`/worker implementer`".

Khi đã đăng nhập, điều hướng tới `#/register` KHÔNG bị redirect về
dashboard (trong khi `#/login` redirect đúng) — trang hiển thị hỗn hợp:
header/breadcrumb của `LayoutDefault` (dashboard) chồng lên form Đăng ký.

## Branch
`fix/register-auth-redirect-guard` — checkout MỚI từ `main` (không phải từ
`feature/login-page-ui-redesign`, dù đang có 3 node UI redesign sealed
chưa `/ship` trên branch đó). Lý do tách: bug này là lỗi LOGIC router
guard, không liên quan phạm vi 3 node UI (chỉ sửa template/style). Đã
`git stash push -u` toàn bộ work-in-progress của
`feature/login-page-ui-redesign` trước khi checkout branch mới, để không
trộn 2 phạm vi khác nhau vào cùng 1 diff. `git branch --show-current` xác
nhận `fix/register-auth-redirect-guard`, không phải `main`.

## Diff
`src/pages/auth/PageRegister.vue` — thêm import `useRouter` (`vue-router`)
và `authStore` (`@/stores/auth`), thêm đúng đoạn check:
```js
const router = useRouter()
...
const store = authStore()
if (store.isAuthenticated) {
    router?.push('/dashboard/information')
}
```
Copy 1:1 pattern đã có sẵn trong `src/pages/auth/PageLogin.vue` (dòng
14-21 bản gốc) — không phát minh cách làm mới, dùng đúng convention đã
tồn tại trong codebase cho trang login.

Không đụng `src/routers/index.ts` (route guard `beforeEach` global) — cách
fix tại router-level (thêm điều kiện chặn `/login`/`/register` khi đã auth
trong `beforeEach`) sẽ ảnh hưởng CẢ 2 trang cùng lúc và là refactor lớn
hơn phạm vi bug được giao (chỉ báo `/register` bị thiếu so với `/login`).
Fix tại component-level giữ nhất quán với cách `PageLogin.vue` đã làm —
SmallestDiff.

## Command
```
npm run build
npm run lint
```

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1339 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                      0.79 kB │ gzip:   0.44 kB
...
dist/assets/PageLogin-dek0PazG.js                    0.97 kB │ gzip:   0.65 kB
dist/assets/PageRegister-CUG1bsVX.js                 1.04 kB │ gzip:   0.64 kB
...
(!) Some chunks are larger than 500 kB after minification. — warning cũ,
không liên quan tới diff này.
✓ built in 4.63s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
Build-only + lint-only evidence — không phải test runtime thật.

## Manual UI check (npm run dev, quan sát thủ công)
Đã có sẵn phiên đăng nhập thật (token thật trong `localStorage`, từ lần
test login trước đó cùng operator, backend production qua
`.env.development.local` tạm thời trỏ `https://nodejs-resume-api-ts.onrender.com/`).
Dùng Chrome remote-debugging (port 9888) + CDP: `Page.navigate` tới
`http://localhost:5173/vue-resume-web/#/register`, `Page.reload`
(`ignoreCache: true`, đảm bảo app boot lại từ đầu, không phải chỉ hash
change).

TRƯỚC fix: URL sau reload dừng lại ở `#/register`, hiển thị trang hỗn hợp
(đã chụp screenshot làm bằng chứng trong lúc report cho operator, không
đính kèm lại ở đây vì đã xoá theo quy tắc không để lại file rác ngoài
`evidence/`).

SAU fix: URL sau reload tự động thành
`http://localhost:5173/vue-resume-web/#/dashboard/information` — xác nhận
guard hoạt động đúng, khớp hành vi `#/login` đã có từ trước.

## Acceptance
| Criterion | Evidence |
|---|---|
| Đã đăng nhập + vào `#/register` → tự redirect về dashboard | URL thật sau reload: `.../#/dashboard/information` |
| Không đổi hành vi `#/login` (đã đúng từ trước) | Không đụng file `PageLogin.vue` — 0 diff |
| Build vẫn xanh | `✓ built in 4.63s` |
| Lint vẫn sạch | exit 0 |
| Branch tách riêng, không trộn với `feature/login-page-ui-redesign` | `git branch --show-current` → `fix/register-auth-redirect-guard`; `git diff main --stat` chỉ 2 file (diagram + `PageRegister.vue`) |

## Noticed, not done
Route guard global (`src/routers/index.ts` → `beforeEach`) vẫn chỉ xử lý 1
chiều (`requiresAuth`). Cách fix hiện tại là vá từng trang
(`PageLogin.vue`/giờ thêm `PageRegister.vue`) — nếu sau này có thêm trang
auth khác (vd quên mật khẩu), sẽ lại thiếu guard trừ khi tự nhớ copy
pattern này. Cân nhắc refactor lên router-level (`meta: { guestOnly: true
}` + xử lý trong `beforeEach`) là việc riêng, KHÔNG tự làm vì ngoài phạm
vi bug được giao (chỉ "register không redirect như login").

## Seal gate
Không chạm outward-facing (không commit/push/merge → main) ở bước này —
chỉ sửa file local trên branch riêng. Merge về `main` cần approval riêng,
qua `/ship`.

## Trạng thái
sealed_pending_verifier
