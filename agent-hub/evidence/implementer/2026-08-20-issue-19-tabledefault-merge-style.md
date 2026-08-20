---
node: issue-19-tabledefault-merge-style
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #19](https://github.com/datvt243/vue-resume-web/issues/19) —
`TableDefault.vue` có 2 khối `<style scoped>` riêng biệt, gộp thành 1.

## Diff
`src/components/table/TableDefault.vue`: gộp `.table-responsive` và
`.height-auto` vào chung 1 khối `<style scoped>` — đúng chính xác cách fix
đề xuất trong issue.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.70s
```
Build xanh. Build-only evidence.

## Trạng thái
sealed_pending_verifier
