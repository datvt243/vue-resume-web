---
node: issue-11-pageinformation-duplicate-key
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #11](https://github.com/datvt243/vue-resume-web/issues/11) —
`PageInformation.vue` có 2 `<VeeForm>` khác nhau cùng `:key="'frm1'"`, Vue
có thể reconcile Virtual DOM sai, dùng nhầm DOM node giữa 2 form.

## Diff
`src/pages/dashboard/PageInformation.vue`:
- Form đầu (`formFields`, `handleUpdate`): `:key="'frm1'"` →
  `:key="'frm-basic-info'"`
- Form sau (`socialMediaFields`, `handleUpdateSocialNetwork`):
  `:key="'frm1'"` → `:key="'frm-social-media'"`

Đúng chính xác cách fix đề xuất trong issue.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.64s
```
Build xanh. Build-only evidence — không có test suite thật.

## Trạng thái
sealed_pending_verifier
