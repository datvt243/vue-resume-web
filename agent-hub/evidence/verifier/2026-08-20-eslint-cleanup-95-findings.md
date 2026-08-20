---
node: eslint-cleanup-95-findings
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (`eslint-cleanup-95-findings`) — OK, node có mặt trên
   diagram với state `IN_PROGRESS` trước khi verify.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/eslint-cleanup-95-findings`. Tự chạy `git branch --show-current` độc
   lập → khớp chính xác. `git status --short` xác nhận chỉ có diff của task
   này + 1 file evidence note untracked, không có gì trên `main`. Pass.
3. Pug false-positive claim (rủi ro cao nhất của review này) — tự chạy `grep
   -rl 'lang="pug"' src/` độc lập: đúng 9 file, khớp 100% danh sách note nêu
   (ExperienceItem, EducationItem, ListTransition, ProjectItem, ItemTemplate,
   LayoutDefault, Footer, LayoutAuth, Header).
4. Đọc TRỰC TIẾP cả 8/9 file pug có disable comment (không tin note, tự mở
   file + grep từng biến trong khối `template lang="pug">`):
   - `Footer.vue`: `yearNow` → dùng ở `{{ yearNow }}`. Match.
   - `LayoutAuth.vue`: `Header`, `Footer` → dùng làm tag pug (`Header` /
     `Footer` đứng riêng dòng). Match.
   - `LayoutDefault.vue`: `Header`, `Footer`, `Main` → tag pug; `getRouterName`
     → `Dropdown(:text="getRouterName($route.path)" ...)`. Match cả 4.
   - `Header.vue`: `Navbar` → tag pug; `_settings` → `.getFile()` (dòng
     `a...(:href="_settings.getFile()")`) và `.getMe()` (dòng
     `a.dropdown-link(:href="_settings.getMe()")`); `authRouter` →
     `li.nav-item(v-for='(r, i) in authRouter' ...)`; `mesUser` →
     `Dropdown(:text="mesUser" ...)`; `_handelLogout` →
     `span.d-block.pointer(@click="_handelLogout")`. Match cả 5.
   - `EducationItem.vue`, `ExperienceItem.vue`, `ProjectItem.vue`: `emits` →
     `@click="emits('onDelete', {...model})"` / `'onEdit'`; `item` →
     `ItemTemplate(:model-value="item")`. Match cả 2 biến × 3 file.
   - `ItemTemplate.vue`: `model` → dùng nhiều chỗ (`model?.image`,
     `model.title`, `model.subTitle`, `model.description`); `getDate` →
     `p.item-note(v-if="getDate") {{ getDate }}`. Match cả 2.
   - Tổng: 17/17 biến có `eslint-disable-next-line no-unused-vars` đều verify
     được tham chiếu thật trong pug template. KHÔNG tìm thấy trường hợp nào
     dead code bị nguỵ trang thành "pug false positive". `ListTransition.vue`
     dùng pug nhưng note claim "0 finding, không đụng" — tự kiểm: không nằm
     trong `git diff main --stat`, không có comment `eslint-disable` nào
     trong file. Match.
5. Verify các claim "xoá thật, không phải false positive" trong cùng 8 file:
   - `ref` import bị xoá ở `Footer.vue`/`LayoutAuth.vue`/`LayoutDefault.vue`
     — `git diff main` cho 3 file này show đúng dòng `-import { ref } from
     'vue'`; grep `\bref\b` trên file hiện tại → không còn match nào. An
     toàn.
   - `_download` + `handleBase` import ở `Header.vue` — `git diff main` show
     xoá cả hàm `_download()` (dùng `handleBase`) và dòng import; grep
     `_download|handleBase` trên file hiện tại → 0 match, kể cả trong pug
     template. An toàn, không phải false positive bị xoá nhầm.
6. Spot-check 2 bug thật (đọc code hiện tại):
   - `Box.vue` dòng 14: `h('div', { class: ['clearfix', props.class] },
     ...)` — đúng như note claim, không còn duplicate key `class`.
   - `Dropdown.vue` dòng 17: `isSm: { type: Boolean, default: false }` — đúng
     default kiểu Boolean thay vì `''`.
7. Spot-check ≥6 dead-code table khác (đọc file thật, không tin note):
   - `src/services/base.js` dòng 92: `for (const [, mess] of
     Object.entries(errors))` — khớp.
   - `src/composables/useDocument.ts`: không còn interface `DeleteParams`/
     `fnDelete`; 3 chữ ký `callback: (_res: Response) => void` (dòng 63, 92,
     116) — khớp `argsIgnorePattern: '^_'`.
   - `src/models/certificate.model.ts`: import chỉ còn `defaultId,
     defaultDescription, defaultDateStartEnd, defaultCheckboxBoolean`, không
     có `defaultLink`. `src/models/project.model.ts`: vẫn import VÀ dùng
     thật `defaultLink({ name: 'link', label: 'Link' })` (dòng 42) — khớp
     claim "khác project.model.ts, file đó thật sự dùng".
   - `src/components/veevalidate/part/FrmSelect.vue`: không còn
     `getPlaceholder`, không còn import `computed`; template chỉ có
     `:data-value`, không có `:placeholder` — khớp.
   - `src/pages/dashboard/PageAward.vue` và `PageCertificate.vue`: không còn
     hàm `handleDelete`; template gọi `deleteDoc({...item}, 'name', res =>
     {...})` trực tiếp trong `@click` — chức năng xoá award/certificate vẫn
     hoạt động bình thường qua đường gọi trực tiếp này.
8. `.eslintrc.cjs` — đọc trực tiếp: `no-unused-vars` có `ignoreRestSiblings:
   true` + `argsIgnorePattern: '^_'`; `vue/multi-word-component-names` có
   `ignores` đúng 11 tên (Modal, Navbar, Spinner, Toasts, Box, Button,
   Dropdown, Heading, Footer, Header, Main). Khớp claim.
9. `npm run lint` — tự chạy độc lập từ repo root: output rỗng, `LINT_EXIT:
   0`. Khớp claim "95 → 0", không phải chỉ "ít lỗi hơn".
10. `npm run build` — tự chạy độc lập: `✓ 1339 modules transformed`, `✓ built
    in 4.57s`, `BUILD_EXIT: 0`. Chỉ có warning chunk-size (pre-existing,
    không liên quan).
11. `git diff main --stat` — tự chạy độc lập: 50 file (48 file `src/` + 1
    `.eslintrc.cjs` + 1 diagram), khớp quy mô "49 file" implementer claim
    (diagram là do implementer tự cập nhật status, tính riêng). `git status
    --short` xác nhận KHÔNG có `yarn.lock`/`package-lock.json` nào bị đụng —
    không lặp lại lỗi REOPEN của node trước (`eslint-lint-actually-runs`).
    Evidence note (`evidence/implementer/...md`) là untracked, chưa commit —
    đúng quy trình (chưa qua Seal Gate).
12. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
    (không `ADHOC_WORK`), có evidence note (không `NO_EVIDENCE`), lint/build
    đã tự chạy lại độc lập (không `EDIT_UNVERIFIED`), không code lẫn vào
    `haven/` (không `CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict
    này (không `DIAGRAM_DRIFT`), diff trên branch riêng, không phải `main`
    (không `MAIN_EDIT`).
13. Seal gate — diff không chạm outward-facing (không commit/push/merge →
    main/deploy.sh) ở bước implementer này. Không cần approval ở bước này.

## Kết luận rủi ro pug
Đây là phần trọng tâm của review này: 17 biến/hàm/import được giữ lại kèm
`eslint-disable-next-line no-unused-vars` trên 7 trong 8 file pug có finding
(`Footer`, `LayoutAuth`×2, `LayoutDefault`×4, `Header`×5, `EducationItem`×2,
`ExperienceItem`×2, `ProjectItem`×2, `ItemTemplate`×2 — tổng 17 lượt disable
trên 8 file, `ListTransition` không có finding nào) — TẤT CẢ đều verify được
tham chiếu thật trong pug template qua đọc trực tiếp + grep độc lập, không
qua trung gian note. Không tìm thấy biến nào bị xoá nhầm dù đang dùng trong
pug (kiểm tra riêng `ref` × 3 file, `_download`/`handleBase` × Header.vue —
grep xác nhận không còn tham chiếu nào, kể cả trong pug).

## Verdict
SEAL.
