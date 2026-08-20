---
node: eslint-cleanup-95-findings
worker: implementer
date: 2026-08-20
---

## Task
Operator: "ok" (đồng ý dọn 95 lỗi lint mà node `eslint-lint-actually-runs`
phát hiện được nhưng cố ý không fix). Không phải GitHub issue — task trực
tiếp từ operator, node riêng trên diagram để tuân thủ `NodeBeforeCode`.

## Branch
`fix/eslint-cleanup-95-findings` (checkout từ `main` trước khi đổi file —
đúng `BranchBeforeCode`).

## Phát hiện quan trọng trước khi sửa (bắt buộc đọc)
`grep -rl 'lang="pug"' src/` → 9 file dùng `<template lang="pug">`:
`ExperienceItem.vue`, `EducationItem.vue`, `ListTransition.vue`,
`ProjectItem.vue`, `ItemTemplate.vue`, `LayoutDefault.vue`, `Footer.vue`,
`LayoutAuth.vue`, `Header.vue`.

`vue-eslint-parser` KHÔNG phân tích được usage bên trong template pug (chỉ
hỗ trợ HTML template chuẩn) → biến/import/hàm chỉ được dùng trong pug bị
báo "unused" SAI (false positive). Đã tự kiểm tra thủ công TỪNG biến bị
flag trong 8/9 file này (đọc cả script lẫn template, grep tên biến trong
markup pug) trước khi quyết định — KHÔNG xoá hàng loạt theo lint output.
Kết quả: phần lớn là false positive (giữ nguyên), một số là code chết thật
(xoá). Chi tiết theo từng file ở bảng Diff.

## Diff (rút gọn theo nhóm)

### `.eslintrc.cjs` — rule tuning (không che giấu lỗi thật)
- `no-unused-vars`: thêm `ignoreRestSiblings: true` (cho idiom
  `const { unwanted, ...rest } = obj`, dùng ở `VeeForm.vue`) và
  `argsIgnorePattern: '^_'` (cho tham số chỉ có trong TS function-type
  signature, vd `(res: Response) => void`, không phải giá trị thật để
  "dùng").
- `vue/multi-word-component-names`: thêm `ignores` cho 11 component đặt
  tên 1 từ theo convention có sẵn của dự án (Modal, Navbar, Spinner,
  Toasts, Box, Button, Dropdown, Heading, Footer, Header, Main) — đổi tên
  file sẽ kéo theo sửa hàng loạt nơi dùng, không đáng.

### Code chết thật — xoá hẳn (không phải false positive)
| File | Xoá gì |
|---|---|
| `App.vue` | import `computed` (không dùng) |
| `Navbar.vue` | `yearNow` (không có trong template HTML thường, khác Footer.vue) |
| `convert.js` | tham số `slots` không dùng trong `Convert` |
| `Box.vue` | **bug thật**: `h('div', { class: 'clearfix', class: props.class })` — key `class` trùng lặp, JS object literal chỉ giữ key sau → `clearfix` không bao giờ được áp dụng. Sửa thành `{ class: ['clearfix', props.class] }` |
| `Dropdown.vue` | **bug thật**: `isSm: { type: Boolean, default: '' }` → `default: false` (default sai kiểu) |
| `GlobalComponents.js`, `initFontAwesomeIcon.js` | tham số `options` không dùng trong `install()` |
| `base.js` | `key` không dùng trong `for (const [key, mess] of ...)` → `for (const [, mess] of ...)` |
| `candidate.js` | import `formatDateToInput` (chỉ dùng trong dòng comment) |
| `table/part/{TableBody,TableCell,TableHead,TableRow}.js` | tham số `attrs` không dùng |
| `VeeForm.vue` | `errors`, `handleSubmit` từ `useForm()` — không dùng ở đâu (component tự check `meta.value.valid` + gọi `submitFn` thủ công) |
| `VeeFormGeneralInformationUpdate.vue` | import `_axios` (không dùng) |
| `FrmArray.vue`, `FrmCheckbox.vue`, `FrmCkediter.vue`, `FrmCurrency.vue` | `useAttrs`/`attrs`, `handleBlur`, `getPlaceholder` — copy-paste từ `FrmInput.vue` nhưng chưa từng wire vào template của các file này |
| `FrmDatePicker.vue` | chỉ `handleBlur` (không dùng); `attrs` vẫn giữ vì thật sự dùng (`Object.hasOwn(attrs, 'monthPicker')`) |
| `FrmInput.vue` | import `watch` (không có lệnh `watch()` nào trong file, khác các Frm khác) |
| `FrmSelect.vue` | `getPlaceholder` (không dùng trong template — template chỉ có `:data-value`, không có `:placeholder`), kéo theo import `computed` cũng hết dùng |
| `useDocument.ts` | interface `DeleteParams`, `fnDelete` (định nghĩa nhưng không bao giờ tham chiếu); đổi tên tham số `res` → `_res` trong 3 chữ ký kiểu `callback: (res: Response) => void` (chỉ là tên tham số trong TS type, không phải biến thật — áp dụng cùng `argsIgnorePattern: '^_'` ở trên) |
| `env.d.ts` | bỏ `// eslint-disable-next-line @typescript-eslint/...` thừa (rule đó chưa từng được bật trong config này nên directive vô nghĩa, tự nó gây lỗi "rule not found") |
| `types/model.type.ts` | import `formatDateToInput` (không dùng); đổi `(yup: any) => any` → `(_yup: any) => any` (tên tham số kiểu, không phải giá trị thật) |
| `models/{award,education,experience,generalInformation,part/index,project}.model.ts` | biến `_mesNumber` định nghĩa nhưng không dùng ở model nào trong nhóm này; `award.model.ts` xoá thêm import `formatDateToInput` không dùng |
| `models/certificate.model.ts`, `models/information.model.ts` | import `defaultLink` không dùng (khác `project.model.ts` — file đó THẬT SỰ dùng `defaultLink`, không đụng tới) |
| `pages/dashboard/{PageEducation,PageExperience}.vue` | import `formatDateToInput` không dùng |
| `pages/dashboard/PageInformation.vue` | import `modalSocial` không dùng (chỉ có trong dòng comment) |
| `pages/dashboard/{PageAward,PageCertificate}.vue` | hàm `handleDelete` chết hẳn — template gọi `deleteDoc({...item}, 'name', ...)` trực tiếp, không gọi qua hàm này (dead code có sẵn từ trước, không liên quan tới fix #45 đã làm ở batch MEDIUM) |
| `pages/dashboard/{PageCertificate,PageProject}.vue` | biến `colHidden` định nghĩa nhưng không tham chiếu ở đâu |
| `pages/auth/PageRegister.vue` | import `ref` không dùng |
| `pages/_layouts/{Footer,LayoutAuth,LayoutDefault}.vue` | import `ref` không dùng (KHÁC với các biến pug false-positive khác trong cùng file — xem mục dưới) |
| `pages/_layouts/Header.vue` | hàm `_download` + `handleBase` import — chết hẳn, `grep "_download"` toàn file chỉ có đúng chỗ định nghĩa, không nơi nào gọi (kể cả template pug) |

### False positive do pug — GIỮ NGUYÊN biến, thêm `eslint-disable-next-line no-unused-vars` kèm lý do
| File | Biến giữ lại (đã verify có dùng trong template pug) |
|---|---|
| `Footer.vue` | `yearNow` (`{{ yearNow }}`) |
| `LayoutAuth.vue` | `Header`, `Footer` (tag trong pug) |
| `LayoutDefault.vue` | `Header`, `Footer`, `Main` (tag), `getRouterName` (`getRouterName($route.path)`) |
| `Header.vue` | `Navbar` (tag), `_settings` (`.getFile()`/`.getMe()`), `authRouter` (`v-for`), `mesUser` (`Dropdown(:text="mesUser")`), `_handelLogout` (`@click`) |
| `EducationItem.vue`, `ExperienceItem.vue`, `ProjectItem.vue` | `emits` (`emits('onDelete', ...)`), `item` (`:model-value="item"`) |
| `ItemTemplate.vue` | `model` (`model.title`...), `getDate` (`{{ getDate }}`) |

`ListTransition.vue` cũng dùng pug nhưng không có finding nào trong 95 lỗi
gốc — không đụng tới.

## Command
```
npm run lint
npm run build
```

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 7.97s
```
Cả 2 lệnh đều chạy sạch — build-only + lint-only evidence, KHÔNG phải test
runtime thật (không có test suite trong dự án này).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run lint` từ 95 lỗi → 0 lỗi | Output trên, exit code 0 |
| Build vẫn xanh sau 49 file đổi | `✓ built in 7.97s` |
| Không xoá nhầm code đang dùng trong pug template | Đã grep + đọc thủ công từng biến trong 8/9 file pug trước khi quyết định xoá/giữ (bảng false-positive ở trên) |
| Rule tuning trong `.eslintrc.cjs` không che giấu lỗi thật | `argsIgnorePattern: '^_'` chỉ áp dụng cho tham số hàm (không phải biến top-level như `_mesNumber` — các biến đó vẫn bị flag đúng và đã xoá thật); `ignoreRestSiblings` chỉ áp dụng cho pattern omit-key rest destructuring |

## Noticed, not done
- Không mở rộng sang việc BẬT thêm rule mới của `eslint-plugin-vue`
  (`vue3-essential` hiện chỉ có rule cơ bản) — ngoài scope, chỉ dọn đúng 95
  finding đã có.
- Không cài `@typescript-eslint/eslint-plugin` ruleset đầy đủ (chỉ dùng
  `@typescript-eslint/parser` để parse) — nếu bật ruleset đó sẽ phát sinh
  thêm rất nhiều finding TS-specific mới, ngoài phạm vi "dọn 95 lỗi hiện
  có".
- File `.vue` dùng pug vẫn còn rủi ro false-positive `no-unused-vars`
  trong tương lai — đã document rõ bằng comment tại chỗ, nhưng nếu có thêm
  biến mới chỉ dùng trong pug, vẫn cần thêm disable comment thủ công
  tương tự (không có fix cấu trúc nào tốt hơn khả thi trong scope task
  này).

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
