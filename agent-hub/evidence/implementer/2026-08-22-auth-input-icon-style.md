---
node: auth-input-icon-style
worker: implementer
date: 2026-08-22
---

## Task
Task trực tiếp từ operator, nối tiếp `login-ui-redesign`/`register-ui-redesign`
trong cùng phiên: "về input, bỏ label, thay vào kiểu icon + input".

Trước khi làm: dùng `AskUserQuestion` để xác nhận phạm vi, vì
`FrmInput.vue`/`FrmPwd.vue` là component DÙNG CHUNG cho mọi form trong app
(education, experience, project...), không riêng gì login/register. Operator
chọn: "Chỉ login/register" — KHÔNG đổi toàn app.

## Branch
`feature/login-page-ui-redesign` — tiếp tục trên branch đã dùng cho 2 node
trước (chưa merge). `git branch --show-current` xác nhận
`feature/login-page-ui-redesign`, không phải `main`.

## Diff
- `src/components/veevalidate/part/FrmInput.vue` — thêm prop `icon` (String,
  default `''`, OPT-IN). Khi `icon` rỗng: hành vi y hệt trước (label hiện,
  input không đổi — `div` bọc ngoài chỉ nhận `class="input-group"` khi có
  icon, không thì không có class nào, không ảnh hưởng layout/CSS). Khi
  `icon` có giá trị: ẩn label (`v-if="props.label && !props.icon"`), hiện
  `<FontAwesomeIcon>` trong `.input-group-text` ở đầu input (Bootstrap
  `input-group` pattern, cùng cách FrmPwd đã dùng cho nút eye-toggle).
- `src/components/veevalidate/part/FrmPwd.vue` — thêm prop `icon` (cùng
  pattern). Ẩn label khi có `icon` (`v-if="!props.icon"`), thêm
  `<span class="input-group-text">` chứa icon TRƯỚC input, giữ nguyên
  `input-group` + eye-toggle `input-group-text` sau input (không đổi).
- `src/plugins/initFontAwesomeIcon.js` — thêm `faEnvelope`, `faLock` vào cả
  import và `library.add(...)`.
- `src/pages/auth/PageLogin.vue` — field `email` thêm `icon: 'fa-solid
  fa-envelope'`, field `password` thêm `icon: 'fa-solid fa-lock'`.
- `src/pages/auth/PageRegister.vue` — field `email` thêm
  `icon: 'fa-solid fa-envelope'`, field `password`/`repassword` thêm
  `icon: 'fa-solid fa-lock'`.

Không đụng file nào khác dùng `FrmInput`/`FrmPwd` (education, experience,
project, award, certificate, reference, general-information...) — các form
đó không truyền `icon` nên không có gì thay đổi ở phía các file đó (0 diff).

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
dist/assets/PageLogin-B2Ji80yo.css                   0.27 kB │ gzip:   0.20 kB
dist/assets/PageRegister-DgbxqyZd.css                0.27 kB │ gzip:   0.21 kB
...
(!) Some chunks are larger than 500 kB after minification. — warning cũ,
không liên quan tới diff này.
✓ built in 4.53s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
Build chạy trên TOÀN BỘ `src/` (kể cả mọi trang dùng `FrmInput`/`FrmPwd`
khác login/register) — build xanh nghĩa là không file nào khác bị vỡ bởi
prop mới. Build-only + lint-only evidence — không phải test runtime thật.

## Manual UI check (npm run dev, quan sát thủ công)
Chrome remote-debugging (port 9888) + CDP (`Page.navigate` +
`Page.captureScreenshot`) — tự chụp screenshot thật của cả `#/login` và
`#/register`. Script CDP tạm trong scratchpad ngoài repo, đã xoá ngay sau
khi dùng.

Quan sát: label "Email"/"Mật khẩu"/"Nhập lại Mật khẩu" đã biến mất ở cả 2
trang, thay bằng icon phong bì (envelope) cho field email và icon ổ khoá
(lock) cho field password/repassword, đặt trong khung bo cùng input theo
kiểu Bootstrap input-group — khớp yêu cầu "bỏ label, thay vào icon +
input". Nút eye-toggle ở field password vẫn hoạt động, đặt cạnh phải, icon
lock vẫn ở cạnh trái — 3 phần tử (icon, input, eye-toggle) join liền mạch
trong 1 khung.

KHÔNG chụp lại 1 trang dashboard (vd education) để xác nhận trực quan
không bị ảnh hưởng, vì cần đăng nhập thật (có token) — thay vào đó dựa vào:
(a) đọc lại code — nhánh `icon` rỗng trả về y hệt cấu trúc DOM cũ; (b)
`npm run build` chạy toàn bộ `src/` xanh, bao gồm mọi file import
`FrmInput`/`FrmPwd`. Ghi rõ đây là suy luận từ code + build, KHÔNG phải
quan sát trực quan trên trang dashboard thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| Label bị bỏ, thay bằng icon + input ở login/register | Screenshot thật qua CDP — cả 2 trang |
| Các form khác (education, experience...) không bị ảnh hưởng | Prop `icon` opt-in, mặc định `''` → nhánh cũ y hệt (đọc code); build xanh trên toàn `src/` |
| Build vẫn xanh | `✓ built in 4.53s` |
| Lint vẫn sạch | exit 0 |
| Scope đã được operator xác nhận trước khi đụng shared component | `AskUserQuestion` — chọn "Chỉ login/register" |

## Noticed, not done
Chưa verify trực quan 1 form dashboard thật (cần login) — xem mục "Manual
UI check" ở trên, đã ghi rõ đây là giới hạn, không phải bỏ sót âm thầm.
Verifier có thể tự đăng nhập (nếu có tài khoản test) để xác nhận thêm nếu
muốn siết chặt hơn mức build-only.

## Seal gate
Không chạm outward-facing (không commit/push/merge → main) ở bước này —
chỉ sửa file local trên branch riêng. Merge về `main` cần approval riêng,
qua `/ship`.

## Trạng thái
sealed_pending_verifier
