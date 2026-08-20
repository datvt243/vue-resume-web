# doctrine/domains/PROJECT.md — ground truth của vue-resume-web

## What is it
SPA quản lý hồ sơ xin việc (Resume/CV) cá nhân. Người dùng đăng nhập, nhập
liệu structured data (thông tin cơ bản, học vấn, kinh nghiệm, dự án, giải
thưởng, chứng chỉ, người tham khảo) qua form, lưu qua REST API riêng
(Node.js resume-api, không nằm trong repo này). Tác giả: Đạt Võ
(@datvt243), dùng cho chính CV của mình.

## Stack + shape
| Thing | Value |
|---|---|
| Language/runtime | Vue 3 (Composition API + `<script setup>`) + TypeScript (partial, mixed với `.js`) |
| Entry point | `src/main.js` → `src/App.vue` |
| Data store | Không có DB local — mọi dữ liệu qua REST API bên ngoài (`src/services/`, `src/config/api.config.js`) |
| Routing | Vue Router 4, config tại `src/routers/index.js` |
| State | Pinia — `src/stores/{auth,candidate}.js` |

## Invariants (things that never happen here)
- Frontend không bao giờ nói chuyện trực tiếp với database — luôn qua REST
  API (`services/`).
- `Authorization: Bearer <token>` được gắn vào mọi request cần auth; token
  sống ở `localStorage` key `"token"`, user ở key `"user"`.
- `_id` có mặt hay không quyết định POST (tạo mới) hay PUT (cập nhật) trong
  `useDocument.updateDoc` — không phải một flag riêng.
- Component trong `src/components/global/` được auto-register qua
  `src/plugins/GlobalComponents.js` — dùng thẳng trong template, KHÔNG cần
  `import`.
- Mỗi section dữ liệu (education, experience, project...) có một file
  `src/models/*.model.ts` định nghĩa cả UI field lẫn Yup validation schema
  trong CÙNG một chỗ — `VeeForm.vue` đọc từ đó để tự render.

## Diagram-first
Diagram (`haven/diagrams/`) là source of truth cho tiến độ — code phải khớp.

## Forbidden states
Xem `CLAUDE.md` — `ADHOC_WORK`, `NO_EVIDENCE`, `EDIT_UNVERIFIED`,
`CODE_IN_HAVEN`, `DIAGRAM_DRIFT`.

## Traps (append khi gặp cái mới)
> Verified trực tiếp từ source code tại thời điểm khởi tạo hub (2026-08-20).
> Đây là bug/technical-debt THẬT đang tồn tại — đừng lặp lại pattern, và
> đừng "tự tiện fix" ngoài vòng `/worker` nếu task không yêu cầu.

| Trap | Why | What to do instead |
|---|---|---|
| `src/routers/index.js` dùng `createMemoryHistory` | URL không hoạt động khi refresh trang (mất route) — [issue #1](https://github.com/datvt243/vue-resume-web/issues/1) | Nếu task là fix routing, đổi sang `createWebHashHistory` hoặc `createWebHistory`, KHÔNG tự ý làm ngoài task được giao |
| `src/services/auth.js:28-34` login dùng `method: 'get'` với `password` trong `params` | Password lộ trong URL/log/history trình duyệt — [issue #2](https://github.com/datvt243/vue-resume-web/issues/2) | Sửa thành POST + body khi có task liên quan đến auth |
| `src/components/veevalidate/VeeForm.vue:36` `delete e.valid` trong `.map()` | Mutate trực tiếp object trong `props.fields` (mảng props bị sửa từ bên trong) — [issue #3](https://github.com/datvt243/vue-resume-web/issues/3) | Dùng destructuring tạo object mới thay vì `delete` trên phần tử gốc |
| `src/components/veevalidate/VeeForm.vue:93` `e.nam` (đáng lẽ `e.name`) trong `reset()` | Reset form set sai key, lỗi thầm lặng — [issue #4](https://github.com/datvt243/vue-resume-web/issues/4) | Sửa `e.nam` → `e.name` khi có task liên quan tới form reset |
| `src/components/Toasts.vue:44` `v-html="props.content"` render trực tiếp message lỗi từ server | XSS nếu server trả message chứa HTML/script — [issue #5](https://github.com/datvt243/vue-resume-web/issues/5) | Sanitize hoặc đổi sang text interpolation khi sửa |
| `src/composables/useHelper.js:14` `loading: toValue(refSpinner)` | Snapshot giá trị Ref tại thời điểm gọi `useHelper()` thay vì trả cả Ref — mất reactivity với spinner sau đó — [issue #9](https://github.com/datvt243/vue-resume-web/issues/9) | Trả về Ref (`refSpinner`) thay vì `toValue(refSpinner)` |
| `GroupTags.vue:20` `tags.value.push(tag.value)` trên `toRef(props, 'modelValue')` | Mutate trực tiếp mảng `modelValue` prop | Copy mảng trước khi push, rồi emit thay vì mutate props |
| `subURL = 'api/v1/'` hardcode riêng ở CẢ `src/services/auth.js` VÀ `src/services/base.js` | DRY violation — sửa base path phải sửa 2 nơi — [issue #17](https://github.com/datvt243/vue-resume-web/issues/17) | Gom về `src/config/api.config.js` khi có task liên quan |
| `yarn.lock` VÀ `package-lock.json` cùng tồn tại ở repo root | Lockfile drift risk — 2 package manager có thể resolve version khác nhau | Dùng npm (có `package-lock.json` mới hơn); KHÔNG chạy `yarn install` trừ khi task yêu cầu dọn lockfile |
| `.eslintrc.cjs` extend `plugin:vue/vue3-essential` nhưng `eslint-plugin-vue` KHÔNG có trong `node_modules`, và không có script `lint` trong `package.json` | Không thể chạy lint hiện tại — verified bằng `ls node_modules/eslint-plugin-vue` (not found) | Không claim "đã lint" cho tới khi dependency được cài + script được thêm |
| Không có test suite nào (0 file test, không có script `test`) | [issue #7](https://github.com/datvt243/vue-resume-web/issues/7) theo dõi việc thêm Vitest | Dùng `npm run build` + kiểm tra thủ công `npm run dev` làm bằng chứng tạm, ghi rõ đây KHÔNG phải test thật trong evidence |

## Decisions, with reasoning
> Một quyết định không ghi lý do sẽ bị một agent tương lai "làm đẹp" mất —
> what đã có trong code, chỉ why là load-bearing.

| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| `<<FILL>>` | `<<FILL: chưa có decision nào có lý do ghi lại — điền khi implementer/operator đưa ra quyết định kỹ thuật thật kèm lý do>>` | `<<FILL>>` | `<<FILL>>` |
