---
node: register-ui-redesign
worker: implementer
date: 2026-08-22
---

## Task
Task trực tiếp từ operator, nối tiếp `login-ui-redesign` trong cùng phiên:
"update luôn cho page register" — áp cùng kiểu giao diện đã làm cho trang
login sang trang đăng ký.

## Branch
`feature/login-page-ui-redesign` — TIẾP TỤC trên branch đã checkout cho
node `login-ui-redesign` (chưa merge về `main`), không tạo branch mới, vì
operator yêu cầu nối tiếp trong cùng phiên làm việc trên cùng cụm UI trang
auth. Xác nhận `git branch --show-current` → `feature/login-page-ui-redesign`,
không phải `main`.

## Diff
`src/pages/auth/PageRegister.vue` — bọc `<Heading>` + `<VeeForm>` trong
`.register-page` (flex, canh giữa ngang/dọc, `min-height: 70vh`) và
`.auth-card` (bo góc `1rem`, padding, `background-color:
var(--bs-tertiary-bg)`, viền `var(--bs-border-color-translucent)`, đổ
bóng) — 100% giống pattern vừa áp cho `PageLogin.vue` ở node trước, để 2
trang auth đồng bộ giao diện. Bỏ `class="auth-container m-auto"
style="max-width: 500px"` cũ (dead class, không có rule CSS nào định
nghĩa — đã xác nhận bằng grep ở node `login-ui-redesign`).

Không đụng `VeeForm.vue` (trap #3/#4), không đụng `LayoutAuth.vue` (shared
với `NotFound.vue`, ngoài scope).

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
✓ 1341 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                      0.79 kB │ gzip:   0.44 kB
...
dist/assets/PageLogin-CVbgEBk6.css                   0.27 kB │ gzip:   0.21 kB
dist/assets/PageRegister-CSohxrJe.css                0.27 kB │ gzip:   0.21 kB
...
(!) Some chunks are larger than 500 kB after minification. — warning cũ,
không liên quan tới diff này.
✓ built in 4.69s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
Build-only + lint-only evidence — không phải test runtime thật.

## Manual UI check (npm run dev, quan sát thủ công)
Cùng cách làm với node `login-ui-redesign`: Chrome đang mở qua
remote-debugging (port 9888) + Chrome DevTools Protocol
(`Page.navigate` → `http://localhost:5173/vue-resume-web/#/register`,
`Page.reload`, `Page.captureScreenshot`) để tự chụp screenshot thật.
Script CDP tạm trong scratchpad ngoài repo, đã xoá ngay sau khi dùng.

Quan sát: card bo góc + đổ bóng, canh giữa viewport, heading "ĐĂNG KÝ"
xanh accent + gạch chân, cả 3 field (Email, Mật khẩu, Nhập lại Mật khẩu)
hiển thị đúng, nút "Register" đúng style — khớp hoàn toàn giao diện trang
login, không vỡ layout.

## Acceptance
| Criterion | Evidence |
|---|---|
| Giao diện trang register đồng bộ với login (card, canh giữa) | Screenshot thật qua CDP |
| Không phá vỡ logic form/validate hiện có | `VeeForm.vue` không bị đụng — 0 diff |
| Build vẫn xanh | `✓ built in 4.69s` |
| Lint vẫn sạch | exit 0 |
| Không mở rộng scope ngoài trang register | `git diff --stat` chỉ đổi `PageRegister.vue` + diagram (ngoài diff `login-ui-redesign` đã có từ trước trên cùng branch) |

## Noticed, not done
Khối CSS `.auth-card` giờ lặp lại y hệt ở CẢ `PageLogin.vue` lẫn
`PageRegister.vue` (DRY nhẹ) — có thể gộp thành 1 class dùng chung (vd
trong `bootstrap.scss` hoặc 1 component `AuthCard`) nhưng KHÔNG tự làm vì
đó là refactor ngoài scope 2 task được giao ("làm đẹp login"/"làm đẹp
register", không phải "gộp style auth"). `NotFound.vue` vẫn còn dùng class
chết `auth-container` cũ — cũng ngoài scope, không tự sửa.

## Seal gate
Không chạm outward-facing (không commit/push/merge → main) ở bước này —
chỉ sửa file local trên branch riêng. Merge về `main` cần approval riêng,
qua `/ship`.

## Trạng thái
sealed_pending_verifier
