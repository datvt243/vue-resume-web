---
node: login-ui-redesign
worker: implementer
date: 2026-08-22
---

## Task
Task trực tiếp từ operator (không phải GitHub issue): "Update lại giao diện
trang login cho đẹp hơn".

## Branch
`feature/login-page-ui-redesign` (checkout từ `main` trước khi đổi file —
đúng `BranchBeforeCode`).

## Diff
`src/pages/auth/PageLogin.vue` — bọc `<Heading>` + `<VeeForm>` trong
`.login-page` (flex, canh giữa cả ngang lẫn dọc, `min-height: 70vh`) và
`.auth-card` (bo góc `1rem`, padding rộng hơn, `background-color:
var(--bs-tertiary-bg)`, viền `var(--bs-border-color-translucent)`, đổ bóng
`box-shadow`). Bỏ `class="auth-container m-auto" style="max-width: 500px"`
cũ — `auth-container` vốn không có rule CSS nào định nghĩa (grep xác nhận,
là class chết), thay bằng `.auth-card` có style thật. Dùng biến CSS
Bootstrap có sẵn (`--bs-tertiary-bg`, `--bs-border-color-translucent`) để
khớp `data-bs-theme="dark"` đã bật toàn cục trong `index.html`, và giữ
nguyên accent xanh `#00d095` + font JetBrains Mono có sẵn trong
`src/styles/bootstrap.scss` — không thêm biến màu mới.

Không đụng `VeeForm.vue` (trap #3 `delete e.valid` mutate props, trap #4
`e.nam` typo — ngoài scope, không tự sửa). Không đụng
`LayoutAuth.vue` (shared với `PageRegister.vue`/`NotFound.vue` — task chỉ
yêu cầu "trang login", không mở rộng sang các trang dùng chung layout đó).

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
✓ 1340 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                      0.79 kB │ gzip:   0.44 kB
dist/assets/TableDefault-C9DomHg-.css                0.13 kB │ gzip:   0.10 kB
dist/assets/PageGeneralInformation-Bx5kFAcz.css      0.13 kB │ gzip:   0.12 kB
dist/assets/PageLogin-CVbgEBk6.css                   0.27 kB │ gzip:   0.21 kB
dist/assets/index-C00Kz4DF.css                     207.62 kB │ gzip:  30.38 kB
dist/assets/VeeForm-R8qNqSad.css                   366.92 kB │ gzip:  50.25 kB
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
Build-only + lint-only evidence — không phải test runtime thật (không có
test suite trong dự án này, xem `doctrine/MEMORY.md`).

## Manual UI check (npm run dev, quan sát thủ công — không phải test tự động)
Dev server đã chạy sẵn (`localhost:5173`, PID có sẵn từ trước). Dùng Chrome
đang mở qua remote-debugging (port 9888, `/open-browser-debugger`) +
Chrome DevTools Protocol (`Page.navigate` tới
`http://localhost:5173/vue-resume-web/#/login`, `Page.reload`,
`Page.captureScreenshot`) để tự chụp screenshot thật của trang, không suy
diễn. Script CDP tạm viết trong scratchpad ngoài repo, đã xoá ngay sau khi
dùng — không sót lại trong repo hay `haven/` (không `CODE_IN_HAVEN`).

Quan sát trực tiếp từ screenshot: card bo góc, đổ bóng, canh giữa đúng cả
chiều ngang lẫn dọc trong viewport, giữ nguyên heading "ĐĂNG NHẬP" màu xanh
accent + gạch chân, input/checkbox/nút "Login" hiển thị đúng, không vỡ
layout, khớp dark theme toàn site.

## Acceptance
| Criterion | Evidence |
|---|---|
| Giao diện trang login được làm mới (card, canh giữa) | Screenshot thật qua CDP — card bo góc + đổ bóng, canh giữa viewport |
| Không phá vỡ logic form/validate hiện có | `VeeForm.vue` không bị đụng — 0 diff |
| Build vẫn xanh | `✓ built in 4.63s` |
| Lint vẫn sạch | exit 0 |
| Không mở rộng scope ngoài trang login | `git diff --stat` chỉ đổi `src/pages/auth/PageLogin.vue` + diagram |

## Noticed, not done
Class `auth-container` (không có rule CSS nào, dead class) vẫn còn dùng ở
`PageRegister.vue` và `NotFound.vue` — ngoài scope task này (chỉ "trang
login"), không tự sửa.

## Seal gate
Không chạm outward-facing (không commit/push/merge → main) ở bước này —
chỉ sửa file local trên branch riêng. Merge về `main` cần approval riêng,
qua `/ship`.

## Trạng thái
sealed_pending_verifier
