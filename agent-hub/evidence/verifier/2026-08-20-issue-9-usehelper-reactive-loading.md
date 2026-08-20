---
node: issue-9-usehelper-reactive-loading
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (issue-9-usehelper-reactive-loading) — OK.
2. Diff khớp cách fix đề xuất trong
   [issue #9](https://github.com/datvt243/vue-resume-web/issues/9):
   `useHelper` trả Ref thay vì snapshot, các nơi gọi `.show()/.hide()` đều
   qua `toValue()`. Tự `git diff main -- src/composables/useHelper.js
   src/services/base.js src/services/auth.js` để đọc lại.
3. Đã tự `grep -rn "loading?.show\|loading?.hide\|loading\.show(\|loading\.hide("
   src/` — xác nhận không còn nơi nào gọi trực tiếp trên Ref chưa unwrap.
   Phát hiện đúng như evidence note ghi: `auth.js` handleRegister trước đó
   gọi `loading.show()` trực tiếp trên Ref — đây là bug runtime thật (Ref
   không có `.show`), không phải scope creep, sửa đúng root cause chung với
   issue #9.
4. `npm run build` — tự chạy lại độc lập, `✓ built in Xs`, không lỗi.
   Build-only evidence.
5. Evidence note implementer tồn tại tại
   `evidence/implementer/2026-08-20-issue-9-usehelper-reactive-loading.md`,
   ghi rõ không chạy `npm run dev` để xác nhận UI — chấp nhận được vì đây
   là bug logic thuần, đối chiếu trực tiếp qua code path.

## Verdict
SEAL.
