---
node: dashboard-shell-redesign
worker: implementer
date: 2026-08-22
---

## Task
Task trực tiếp từ operator (không phải GitHub issue), nối tiếp đợt
redesign login/register: "làm lại UI theo dashboard cơ bản" (operator đang
đứng ở trang `/dashboard/information`).

Trước khi làm: dùng `AskUserQuestion` để xác nhận phạm vi (2 lựa chọn: chỉ
trang `PageInformation.vue` đang xem, hay cả shell dashboard dùng chung
cho mọi trang). Operator chọn: **cả shell dashboard** (`Header.vue` phần
authenticated + breadcrumb/dropdown chọn section trong `LayoutDefault.vue`)
— ảnh hưởng TẤT CẢ trang dashboard vì dùng chung layout, KHÔNG chỉ trang
đang xem.

## Branch
`feature/dashboard-shell-redesign` — checkout MỚI từ `main` (đã có
`register-auth-redirect-guard` merge sẵn), KHÔNG chung với
`feature/auth-ui-redesign` (đang `git stash`, 3 node UI login/register đã
sealed nhưng chưa `/ship`, khác phạm vi — task đó chỉ đụng
`PageLogin.vue`/`PageRegister.vue`/`FrmInput.vue`/`FrmPwd.vue`, task này
đụng `Header.vue`/`LayoutDefault.vue`). `git branch --show-current` xác
nhận `feature/dashboard-shell-redesign`, không phải `main`.

## Diff
- `src/plugins/initFontAwesomeIcon.js` — thêm `faFileLines` (icon brand),
  `faGauge` (icon breadcrumb "Dashboard") vào import + `library.add(...)`.
- `src/pages/_layouts/Header.vue` — CHỈ sửa nhánh `v-else` (authenticated,
  dòng ~75 bản gốc), KHÔNG đụng nhánh `v-if="!store.isAuthenticated"`
  (navbar cho login/register, ngoài scope "dashboard"):
  - `header` tăng padding (`py-2`→`py-3`), thêm `shadow-sm`.
  - `.navbar-brand` thêm icon `fa-file-lines` màu `text-success` (accent
    xanh `#00d095` có sẵn) + `fw-bold`.
  - Nút "Download CV": thêm `rounded-pill` (pill button, khớp thẩm mỹ
    login/register vừa làm).
  - Bỏ wrapper `div.clearfix.pe-4` thủ công quanh nút Download, thay bằng
    `gap-2` trên flex container cha — cùng hiệu ứng spacing, ít markup
    hơn.
  - Không đụng logic (`_settings`, `mesUser`, `_handelLogout`,
    `authRouter`) — chỉ template/class.
- `src/pages/_layouts/LayoutDefault.vue` — breadcrumb/dropdown chọn
  section:
  - Bọc toolbar trong `.dashboard-toolbar` (card: `background-color:
    var(--bs-tertiary-bg)`, `border: 1px solid
    var(--bs-border-color-translucent)`, `border-radius: 0.75rem`,
    padding) — thay cho `.border-bottom` phẳng cũ.
  - Thêm icon `fa-gauge` trước chữ "Dashboard" trong breadcrumb.
  - Đơn giản hoá cấu trúc: bỏ `.col-auto`/`.d-flex` lồng nhau thừa (vốn là
    tàn dư Bootstrap grid dùng sai ngữ cảnh, không có `.row` bao ngoài),
    thay bằng `.flex-grow-1` trực tiếp trên `.dashboard-toolbar` (đã có
    sẵn `d-flex.align-items-center`) — cùng kết quả layout, ít lồng div
    hơn.
  - Không đụng logic `routers`/`getRouterName` — chỉ template/style.
  - `#reload` (Teleport target, hiện không có Teleport nào active trong
    codebase — đã `grep` xác nhận) vẫn giữ nguyên vị trí trong DOM, không
    xoá.

Không đụng nội dung riêng từng trang dashboard (`PageInformation.vue`,
`PageEducation.vue`...) — đúng scope operator xác nhận.

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
(!) Some chunks are larger than 500 kB after minification. — warning cũ,
không liên quan tới diff này.
✓ built in 4.60s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
Build-only + lint-only evidence — không phải test runtime thật.

## Manual UI check (npm run dev, quan sát thủ công)
Chrome remote-debugging (port 9888) + CDP (`Page.navigate` +
`Page.captureScreenshot`), dùng session đăng nhập thật có sẵn từ trước
(token thật, backend production qua `.env.development.local` tạm trỏ
`https://nodejs-resume-api-ts.onrender.com/`).

- `#/dashboard/information`: header có icon file + "Resume API" đậm, nút
  "Download CV" dạng pill viền xanh, toolbar breadcrumb dạng card bo góc
  với icon gauge trước "Dashboard", dropdown "Thông Tin Cơ Bản" hiển thị
  đúng. Không vỡ layout.
- `#/dashboard/education`: shell y hệt (header, toolbar card) áp dụng
  nhất quán, dropdown hiển thị đúng "Học Vấn" là section active, dữ liệu
  giáo dục thật (Cao Đẳng Kỹ Thuật Cao Thắng...) load và render đúng bên
  trong shell mới — xác nhận layout dùng chung không phá nội dung riêng
  từng trang.

## Acceptance
| Criterion | Evidence |
|---|---|
| Header (authenticated) có giao diện mới, nhất quán login/register | Screenshot — icon brand, pill button |
| Breadcrumb/dropdown chọn section có giao diện mới | Screenshot — toolbar card + icon gauge |
| Áp dụng cho MỌI trang dashboard (không chỉ trang đang xem) | Test cả `#/dashboard/information` lẫn `#/dashboard/education` — cùng shell |
| Không đụng nội dung riêng từng trang | 0 diff ở mọi file `Page*.vue` trong `src/pages/dashboard/` |
| Không đụng navbar login/register | 0 diff ở nhánh `v-if="!store.isAuthenticated"` trong `Header.vue`, 0 diff `Navbar.vue`/`LayoutAuth.vue` |
| Build vẫn xanh | `✓ built in 4.60s` |
| Lint vẫn sạch | exit 0 |

## Noticed, not done
- Trang Education hiển thị `[object Object]` thay vì text mô tả — bug có
  sẵn, KHÔNG liên quan tới diff này (không đụng `PageEducation.vue`),
  ngoài scope, không tự sửa.
- Lần đầu vào `#/dashboard/information` bằng reload cứng (`Page.reload`),
  form hiển thị rỗng (Pinia store `candidateStore` bị reset, cần
  `App.vue`'s `onMounted` fetch lại — có độ trễ mạng tới backend
  production, không kịp trong lúc chụp). Không phải regression từ diff
  này (không đụng `App.vue`/`PageInformation.vue`); xác nhận lại bằng
  trang Education load thành công ngay sau đó.

## Seal gate
Không chạm outward-facing (không commit/push/merge → main) ở bước này —
chỉ sửa file local trên branch riêng. Merge về `main` cần approval riêng,
qua `/ship`.

## Correction (sau REOPEN lần 1)
Verifier (phiên độc lập) REOPEN với lý do CÓ CĂN CỨ: tag `header` bao
ngoài CẢ 2 nhánh `v-if="!store.isAuthenticated"`/`v-else` trong
`Header.vue` — claim gốc "CHỈ sửa nhánh `v-else`" sai, vì class đổi
(`py-2`→`py-3`, thêm `shadow-sm`) nằm trên chính tag `header` dùng chung,
nên rò rỉ sang navbar login/register (`LayoutAuth.vue` render cùng
`Header.vue`). Bản thân verifier grep xác nhận `LayoutAuth.vue` dùng
chung component.

Fix: revert đúng dòng đó về nguyên bản `header.py-2.border-bottom.bg-body-tertiary`
(bỏ hẳn `py-3`/`shadow-sm`, không tìm cách "vá" bằng chọn lọc phức tạp
hơn — SmallestDiff). Mọi thay đổi khác (icon brand, pill button Download
CV, `gap-2`, toolbar card trong `LayoutDefault.vue`) đều đã nằm đúng
trong nhánh/file được phép từ đầu, không cần sửa.

Re-verify thủ công sau fix:
- `npm run build` → `✓ built in 4.39s`, `npm run lint` → exit 0.
- Xoá `localStorage` token, vào thẳng `#/login` (chưa đăng nhập) qua CDP
  screenshot → navbar về đúng style gốc (không còn `shadow-sm`, padding
  như cũ), khớp ảnh chụp trước khi có node `login-ui-redesign`/
  `auth-ui-redesign` (branch này không có 2 node đó).
- Điền lại form + submit login thật (không dùng Chrome autofill vì
  autofill không bắn `input` event khiến VeeValidate không nhận diện —
  phải tự dispatch `input`/`blur` qua CDP), xác nhận đăng nhập lại thành
  công, `#/dashboard/information` vẫn hiển thị đúng shell mới (header
  icon + pill button, toolbar card) không đổi so với trước fix.

## Trạng thái
sealed_pending_verifier (lần 2, sau correction — cần verifier pass mới,
không tự SEAL)
