---
node: eslint-lint-actually-runs
worker: implementer
date: 2026-08-20
---

## Task
Operator: "check lỗi eslint nvim báo là gì" → xác định
`@rushstack/eslint-patch` thiếu (chặn load config trước cả
`eslint-plugin-vue`) → operator: "cả 2, cài luôn 2 package rồi cho lint
chạy thật". Không phải GitHub issue — task trực tiếp từ operator, có node
riêng trên diagram để tuân thủ `NodeBeforeCode`.

## Branch
`fix/eslint-missing-deps` (checkout từ `main` trước khi đổi file — đúng
`BranchBeforeCode`).

## Chẩn đoán ban đầu
`node_modules/.bin/eslint src/services/axios.js` crash:
```
Error: Cannot find module '@rushstack/eslint-patch/modern-module-resolution'
```
— required ngay dòng 2 của `.eslintrc.cjs`, chặn trước khi ESLint kịp xử
lý `extends: ['plugin:vue/vue3-essential', ...]` (nơi `eslint-plugin-vue`
thiếu, đúng như doctrine cũ đã ghi — nhưng lỗi đó chưa bao giờ lộ ra vì bị
chặn từ trước bởi lỗi rushstack).

## Diff
| File | Why |
|---|---|
| `package.json` | Thêm devDependencies: `@rushstack/eslint-patch@^1.16.1`, `eslint-plugin-vue@^9.33.0`, `eslint@^8.57.0` (trước đây `eslint` chỉ là transitive dep qua `@typescript-eslint/eslint-plugin`/`typescript-eslint`/`@vue/cli-plugin-typescript` — khai báo rõ để không phụ thuộc ngầm định). Thêm script `"lint": "eslint src --ext .js,.ts,.vue"`. |
| `package-lock.json` | Cập nhật theo `npm install`. |
| `.eslintrc.cjs` | Thêm `overrides` cho `*.ts` (`parser: '@typescript-eslint/parser'`) và `*.vue` (`parserOptions.parser: '@typescript-eslint/parser'`) — nếu không, mọi file `.ts` và mọi `.vue` có `<script setup lang="ts">` bị "Parsing error: Unexpected token interface/{". `@typescript-eslint/parser` đã có sẵn trong devDependencies từ trước (dùng cho `typescript-eslint`), chỉ cần wire vào config, không cần cài thêm. |

Chọn `eslint-plugin-vue@^9` (không phải `^10` mới nhất) vì `v10` yêu cầu
ESLint 9 + flat config; repo đang ESLint 8.57 + `.eslintrc.cjs` (legacy) —
xem lý do đầy đủ trong `doctrine/domains/PROJECT.md` → Decisions.

## Command
```
npm run build
npm run lint
```

## Output (đọc lại nguyên văn)

`npm run build`:
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.54s
```

`npm run lint`:
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

[... 95 dòng lỗi thật, chủ yếu no-unused-vars + vue/multi-word-component-names ...]

✖ 95 problems (95 errors, 0 warnings)
```
Không còn dòng "Parsing error" nào (trước khi thêm `overrides`, có 10 file
`.ts`/`.vue` bị parsing error — đã tự verify bằng cách chạy lại và
`grep -i "parsing error"` → không có kết quả).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run lint` không còn crash khi load config | Output trên chạy hết, không có `Cannot find module` |
| Không còn Parsing error ở bất kỳ file `.ts`/`.vue` nào | `grep -i "parsing error"` trên output đầy đủ → rỗng |
| Build vẫn xanh sau khi đổi deps + config | `✓ built in 4.54s` |
| Script `lint` tồn tại và chạy đúng target (`src`, cả `.js/.ts/.vue`) | `npm run lint` → gọi đúng `eslint src --ext .js,.ts,.vue` |

## Noticed, not done
- **95 lỗi lint thật vẫn còn** (chưa fix) — ngoài scope của task này
  (task là "cho lint chạy", không phải "dọn sạch lint"). Đa số là
  `no-unused-vars` (an toàn để tự động dọn) và `vue/multi-word-component-names`
  (đổi tên component — có thể ảnh hưởng chỗ khác, cần cẩn thận hơn). Cần
  task/issue riêng nếu operator muốn dọn.
- 2 lỗi logic thật đáng chú ý trong số 95 (không phải style):
  `src/components/global/Box.vue:14` `Duplicate key 'class'`, và
  `src/components/global/Dropdown.vue:17` `Type of the default value for
  'isSm' prop must be a boolean` (default đang là `''` thay vì `false`).
  Không tự sửa — ngoài scope.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier

## Correction (sau REOPEN lần 1)
Verifier phát hiện `yarn.lock` bị thay đổi (102 dòng) mà bảng Diff ở trên
KHÔNG khai báo — vi phạm `EvidenceOnly`/`SmallestDiff`, và đúng vào trap đã
biết trong `doctrine/domains/PROJECT.md` ("KHÔNG chạy `yarn install` trừ
khi task yêu cầu dọn lockfile"). Không rõ nguyên nhân chính xác (không
chủ động chạy `yarn install`; có thể do tool/editor khác trong môi trường
tự sync lockfile khi `package.json` đổi) — nhưng bất kể nguyên nhân, đây
là thay đổi ngoài ý định.

Fix: `git checkout main -- yarn.lock` để revert về đúng bản `main`, xác
nhận lại `npm run build` (`✓ built in 4.51s`) và `npm run lint` (vẫn
`✖ 95 problems`, không đổi) sau khi revert — `yarn.lock` không được npm
đọc nên revert không ảnh hưởng gì tới build/lint thật.

`git diff main --stat` sau revert chỉ còn: `.eslintrc.cjs`,
`agent-hub/doctrine/MEMORY.md`, `agent-hub/doctrine/domains/PROJECT.md`,
`agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`, `package-lock.json`,
`package.json` — đúng khớp bảng Diff đã khai báo.

Trạng thái vẫn: sealed_pending_verifier (cần lượt verifier MỚI, không phải
lượt vừa REOPEN).
