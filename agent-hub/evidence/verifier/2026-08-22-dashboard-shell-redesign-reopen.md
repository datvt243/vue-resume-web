---
node: dashboard-shell-redesign
worker: verifier
date: 2026-08-22
verdict: REOPEN
---

## Acceptance criteria checked

1. Refusal check (`NeverVerifyOwnWork`) — this is a fresh session, did not
   write the diff under review. Proceed.

2. Node trace — `dashboard-shell-redesign` present on
   `haven/diagrams/dev-loop.prime-mermaid.md` with state `IN_PROGRESS`,
   description matches the note (shell-only scope: `Header.vue` phần
   authenticated + breadcrumb/toolbar `LayoutDefault.vue`, KHÔNG đụng nội
   dung riêng từng trang, KHÔNG đụng navbar login/register). Pass.

3. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `feature/dashboard-shell-redesign`. Tự chạy `git branch --show-current`
   độc lập → khớp chính xác (`feature/dashboard-shell-redesign`, không
   phải `main`). Pass.

4. `git diff --stat` (tự chạy độc lập, working tree, chưa commit):
   ```
   agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |  2 ++
   src/pages/_layouts/Header.vue                      | 21 +++++++-------
   src/pages/_layouts/LayoutDefault.vue               | 33 +++++++++++++---------
   src/plugins/initFontAwesomeIcon.js                 |  4 +++
   4 files changed, 36 insertions(+), 24 deletions(-)
   ```
   Đúng 3 file code claimed (`Header.vue`, `LayoutDefault.vue`,
   `initFontAwesomeIcon.js`) + diagram registration. KHÔNG có
   `Page*.vue`, `Navbar.vue`, `LayoutAuth.vue` trong diff — khớp claim "0
   diff ở các file đó" theo nghĩa đen.

5. `npm run build` — tự chạy lại độc lập từ repo root: `✓ built in 4.68s`,
   không lỗi (chunk-size warning sẵn có, không liên quan). Khớp claim.

6. `npm run lint` — tự chạy lại độc lập từ repo root: không có output,
   `EXIT:0`. Khớp claim.

7. **Đọc trực tiếp `src/pages/_layouts/Header.vue` hiện tại + kiểm ai dùng
   component này** (đây là bước đọc file thật để confirm claim ranh giới
   scope, không phải đọc diff thay note) — phát hiện vấn đề:

   Diff thật của `Header.vue`:
   ```
   -header.py-2.border-bottom.bg-body-tertiary
   +header.py-3.border-bottom.bg-body-tertiary.shadow-sm
       template(v-if="!store.isAuthenticated")
           ...
       .container(v-else)
   ```
   Dòng `header.py-3...shadow-sm` là **thẻ cha bao NGOÀI cả hai nhánh**
   `v-if`/`v-else` — không nằm trong nhánh `v-else` (authenticated) như
   note claim. `grep` xác nhận `Header.vue` được import và render bởi CẢ
   `LayoutDefault.vue` (dashboard) LẪN `LayoutAuth.vue` (login/register:
   `import Header from '@/pages/_layouts/Header.vue'` dòng 9, `Header`
   dòng 16). Vì class đổi trên thẻ `header` cha, không phải trong khối
   con `v-else`, thay đổi padding (`py-2`→`py-3`) và `shadow-sm` áp dụng
   **vô điều kiện** — kể cả khi `store.isAuthenticated` là `false`, tức
   là **navbar trang login/register (LayoutAuth.vue) cũng đổi giao diện**
   (thêm shadow, tăng padding).

   Điều này mâu thuẫn trực tiếp với:
   - Yêu cầu task gốc: "NOT to touch the unauthenticated navbar branch
     used by login/register pages."
   - Claim của chính note: "CHỈ sửa nhánh `v-else` (authenticated),
     KHÔNG đụng nhánh `v-if=\"!store.isAuthenticated\"`" và acceptance
     row "Không đụng navbar login/register | 0 diff ở nhánh
     `v-if=\"!store.isAuthenticated\"` trong `Header.vue`, 0 diff
     `Navbar.vue`/`LayoutAuth.vue`".

   Claim "0 diff trong khối `v-if`" đúng theo nghĩa đen (không dòng nào
   trong khối con đó đổi), nhưng đây là false-negative — phần tử cha bao
   ngoài cả hai nhánh đổi thì kết quả render của nhánh `v-if` VẪN đổi.
   Note không hề kiểm bằng mắt trang `/login` hay `/register` sau khi
   sửa (mục "Manual UI check" chỉ liệt kê `#/dashboard/information` và
   `#/dashboard/education`) — nên regression này chưa từng được quan sát
   thật.

8. Quét 6 forbidden states: không `ADHOC_WORK` (có node), không
   `NO_EVIDENCE` (có note), **`EDIT_UNVERIFIED`** — note claim "Không đụng
   navbar login/register" nhưng chưa thực sự verify bằng cách xem
   `/login`/`/register` sau khi đổi `header` classes dùng chung, trong khi
   code thật cho thấy rủi ro rò rỉ visual là có thật. Không `CODE_IN_HAVEN`.
   Không `DIAGRAM_DRIFT` (node vẫn `IN_PROGRESS`, không tự nhận SEALED).
   Không `MAIN_EDIT` (branch riêng, xác nhận ở bước 3).

## Verdict
REOPEN.

## Missing
- Acceptance criterion "Không đụng navbar login/register" chưa đạt trên
  thực tế: `header.py-2.border-bottom.bg-body-tertiary` →
  `header.py-3.border-bottom.bg-body-tertiary.shadow-sm` nằm trên thẻ cha
  dùng chung cho cả nhánh `v-if` (unauthenticated, dùng bởi
  `LayoutAuth.vue` → login/register) lẫn nhánh `v-else` (authenticated
  dashboard) — thay đổi này rò rỉ sang navbar login/register dù note
  claim đã cô lập đúng nhánh `v-else`.
- Cần: (a) hoặc di chuyển class `py-3`/`shadow-sm` vào riêng nhánh
  `v-else` (giữ `header` cha ở class gốc `py-2.border-bottom.bg-body-tertiary`),
  hoặc (b) nếu chủ đích muốn đổi cả `header` chung, phải xin lại xác nhận
  scope từ operator (vì task đã chốt rõ "KHÔNG đụng navbar login/register")
  và note phải bổ sung manual UI check thật trên `#/login`/`#/register`
  làm bằng chứng.
- Build (`✓ built in 4.68s`) và lint (`exit 0`) đã tự verify lại độc lập —
  hai tiêu chí này KHÔNG phải lý do REOPEN, giữ nguyên pass.
