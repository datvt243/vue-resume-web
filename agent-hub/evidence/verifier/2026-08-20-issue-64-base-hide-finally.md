---
node: issue-64-base-hide-finally
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (`issue-64-base-hide-finally`) — OK, node có mặt
   trên diagram với state `IN_PROGRESS` trước khi verify, mô tả khớp note.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/issue-64-base-hide-finally`. Tự chạy `git branch --show-current`
   độc lập → khớp chính xác. `git status --short` xác nhận chỉ có diff của
   task này (`src/services/base.ts` + diagram + evidence note mới), không
   có gì trên `main`. Pass.
3. Đọc trực tiếp `src/services/base.ts` hiện tại (rủi ro cao — thay đổi
   error-handling ảnh hưởng spinner toàn app — nên tự đọc code thật thay vì
   chỉ tin note): `handleFrameFetch` giờ có
   `try { await action?.(axiosOptions, toast, callback) } finally { toValue(loading)?.hide() }`
   — `hide()` nằm đúng trong `finally`, luôn chạy dù `action` thành công hay
   lỗi. Outer `catch (err) { throw new Error(\`fn handleBase, ${err}\`) }`
   đã bị xoá hẳn, không còn dấu vết. `toValue(loading)?.show()` vẫn đứng
   nguyên vị trí trước khối `try`, không đổi. Pass.
4. Đối chiếu `git diff main -- src/services/base.ts`: diff CHỈ có đúng
   khối try/catch → try/finally + xoá catch — không thêm type annotation,
   không sửa gì khác trong file. Khớp claim "Noticed, not done" của note
   rằng các diagnostic TypeScript implicit-any dòng 12/16/24/25/41 là có
   sẵn từ trước, không đụng tới.
5. Kiểm claim cốt lõi "action tự `.catch()` bên trong, không bao giờ throw
   ra ngoài với code hiện tại" — đọc `handleBase` (cùng file, dòng 12-39):
   `action` truyền vào `handleFrameFetch` là hàm async gọi
   `await _axios(_props).then(res => {...}).catch(err => { __helper.error(err) })`.
   `__helper.error` (dòng 73-111) chỉ gọi `toast?.()` và có thể
   `store?.logOut()` — không có `throw`/rethrow nào trong toàn bộ chuỗi
   `.then()/.catch()`. Với luồng gọi thực tế (axiosOptions luôn là object
   hợp lệ từ `useDocument`/`useCandidate`), path duy nhất async này thoát
   ra là resolve, không bao giờ reject/throw tới `handleFrameFetch`. Claim
   đúng cho code path thực tế đang dùng.
   Lưu ý biên (không đủ để REOPEN, chỉ ghi nhận): nếu `axiosOptions` là
   `undefined`/`null`, dòng destructure `const { method, url, ... } =
   axiosOptions` sẽ throw đồng bộ TRƯỚC khi chạm `.catch()` nội bộ — vì
   `action` là hàm `async`, throw này thành promise reject, `await
   action?.(...)` trong `handleFrameFetch` sẽ nhận exception đó. Đây KHÔNG
   phải regression: trước fix, path này vẫn throw (qua outer `catch` cũ,
   bọc thành `Error` mới) và hide() vẫn KHÔNG chạy — đúng bug gốc #64. Sau
   fix, path này vẫn throw (không còn bị bọc lại), nhưng hide() giờ LUÔN
   chạy nhờ `finally` — thay đổi duy nhất là error propagate ra ngoài giữ
   nguyên type gốc thay vì bị wrap thành `Error(\`fn handleBase, ...\`)`,
   không ai bắt exception này ở cả 2 phiên bản (handleBase cũng không có
   try/catch bọc `handleFrameFetch`) → hành vi "throw uncaught ra khỏi
   handleBase" giống nhau ở cả hai bản, chỉ khác message/type của lỗi. Vô
   hại, không phải regression, không REOPEN vì lý do này — đúng tinh thần
   xử lý biên tương tự đã áp dụng cho node `issue-15-auth-error-handling`
   khi xét cùng file này.
6. `npm run build` — tự chạy lại độc lập từ repo root:
   `dist/assets/VeeForm-BMaohLCb.js` 1,025.73 kB (warning chunk-size sẵn
   có, không liên quan), `✓ built in 4.90s`. Không lỗi.
7. `npm run lint` — tự chạy lại độc lập từ repo root: không có output, exit
   code 0 (`echo $?` sau lệnh riêng, không qua pipe để tránh đọc nhầm exit
   code của `tail`). Khớp claim note.
8. `git diff main --stat` — tự chạy độc lập:
   ```
    agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |  3 ++-
    src/services/base.ts                               | 12 +++++-------
    2 files changed, 7 insertions(+), 8 deletions(-)
   ```
   Đúng 1 file code (`src/services/base.ts`) + diagram (evidence note mới
   là untracked file, không tính trong diff main). Không scope creep.
9. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note implementer (không
   `NO_EVIDENCE`), build+lint đã tự verify lại độc lập (không
   `EDIT_UNVERIFIED`), không có code lẫn vào `haven/` (không
   `CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict này (không
   `DIAGRAM_DRIFT`), diff làm trên branch riêng
   `fix/issue-64-base-hide-finally`, không phải `main` (không `MAIN_EDIT`).
10. Seal gate — diff không chạm outward-facing (không commit/push/merge
    branch → main/`deploy.sh`/API thật) trong bước implementer này. Không
    cần approval ở bước này; merge về `main` là bước outward-facing riêng
    sau (`/ship`).
11. `SmallestDiff` — diff nhỏ nhất có thể để fix đúng bug: đổi vị trí 1
    dòng (`hide()`) + xoá 1 khối `catch` chết. Không sửa gì thêm.

## Verdict
SEAL.
