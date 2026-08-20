---
node: issue-15-auth-error-handling
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (`issue-15-auth-error-handling`) — OK, node có mặt
   trên diagram với state `IN_PROGRESS` trước khi verify.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/issue-15-auth-error-handling`. Tự chạy `git branch --show-current`
   độc lập → khớp chính xác (`fix/issue-15-auth-error-handling`). `git
   status --short` xác nhận chỉ có diff của task này (auth.js + diagram +
   note mới), không có gì trên `main`. Pass.
3. Đọc trực tiếp `src/services/auth.js` hiện tại (rủi ro cao — refactor
   business logic login/register — nên tự đọc code thật thay vì chỉ tin
   note): đúng 1 khối `try/catch/finally` mỗi hàm, không còn `.then()`/
   `.catch()` nào, không còn `console.log({err})`. Pass.
4. Đối chiếu hành vi với bản gốc qua `git show main:src/services/auth.js`:
   - `handleLogin`: cùng shape POST login (`email.trim()`/`password.trim()`).
     Toast success dùng `loginRes.message`, xảy ra TRƯỚC candidate fetch —
     khớp thứ tự gốc (bản gốc toast ở `.then()` đầu tiên, trước `.then()`
     thứ hai fetch candidate).
   - GET candidate vẫn dùng `email.trim()` + `token` từ login response, vẫn
     gọi `candidateStore().setCandidate({...res.data})`.
   - `authStore().setToken`, `tokenRefresh && setRefreshToken`, `setUser`,
     `router?.push('/dashboard/information')` — giữ nguyên thứ tự và điều
     kiện y hệt bản gốc.
   - Lỗi ở BẤT KỲ bước nào trong chuỗi vẫn ra đúng toast `{message: 'Đăng
     nhập thất bại', bg: 'danger'}` — khớp hành vi THẬT của bản gốc (inner
     `.catch()` xử lý toast này, không phải outer catch chết
     `throw new Error(err)`, vốn không bao giờ chạy được).
   - `toValue(loading)?.show()` trước try; bản gốc `hide()` chạy vô điều
     kiện sau chuỗi (vì inner `.catch()` luôn nuốt lỗi nên outer try không
     bao giờ throw) → tương đương hành vi với `finally{hide()}` mới: đúng 1
     lần hide, không double-hide, không path nào bị miss.
   - `handleRegister`: cùng shape POST register (không trim, khớp gốc), cùng
     toast success `res.message` + `router?.push('/login')`, cùng toast lỗi
     dùng `message` từ error + `''`. LƯU Ý: bản mới thêm default
     `const { message = '' } = err` (gốc không có default, `message`
     `undefined` sẽ ra chuỗi `"undefined"` trong toast). Đây là khác biệt
     hành vi thật nhưng cực hẹp — chỉ trigger khi lỗi thiếu field `message`,
     mà `_axios` (`src/services/axios.js`) luôn reject với object có sẵn
     `message` (either `response.data` hoặc fallback `{message: 'Lỗi kết
     nối...'}`) nên path đó không thực tế xảy ra qua flow hiện tại. Xem như
     cải thiện phòng thủ vô hại, không phải regression — không đủ để
     REOPEN, nhưng note claim "hành vi giữ nguyên 100%" hơi quá tuyệt đối.
   - Cùng show/hide spinner timing qua `try/finally`.
5. Quét `console.log`/`.then()`/`.catch()` còn sót — grep độc lập trên file
   mới: không còn. Pass.
6. `npm run build` — tự chạy lại độc lập từ repo root: `✓ 1339 modules
   transformed`, warning chunk-size sẵn có (không liên quan), `✓ built in
   4.59s`. Không lỗi. Build-only evidence, đúng doctrine (không có test
   suite thật).
7. `git diff main --stat` — tự chạy độc lập:
   ```
   agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |   1 +
   src/services/auth.js                               | 137 ++++++++-------------
   2 files changed, 54 insertions(+), 84 deletions(-)
   ```
   Đúng 1 file code (`src/services/auth.js`) + diagram, không scope creep.
8. Spot-check claim "base.js/axios.js không có bug pattern tương tự":
   `src/services/axios.js` — không có outer try/catch mix với .then/.catch,
   claim đúng cho file này. `src/services/base.js` —
   `handleFrameFetch`'s outer `try { await action(...) } catch(err) { throw
   new Error(...) }` KHÔNG hoàn toàn sạch: `action` (định nghĩa trong
   `handleBase`) tự nó có `.then().catch(err => __helper.error(err))` không
   rethrow, nên outer catch của `handleFrameFetch` cũng gần như dead code
   theo cấu trúc tương tự bug gốc của issue #15. Ghi nhận đây là điểm
   KHÔNG hoàn toàn khớp claim của note, nhưng: (a) node
   `issue-15-auth-error-handling` trên diagram chỉ định phạm vi
   `services/auth.js`, không bao gồm `base.js`; (b) không sửa `base.js` là
   làm ÍT hơn chứ không phải làm SAI — không vi phạm `SmallestDiff`; (c)
   không phải regression trong diff đang xét. Không REOPEN vì lý do này,
   nhưng nên mở node/issue riêng cho `base.js` sau (không tự ý mở rộng scope
   ở đây).
9. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note (không `NO_EVIDENCE`), build đã
   tự verify lại độc lập (không `EDIT_UNVERIFIED`), không có code lẫn vào
   `haven/` (không `CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict này
   (không `DIAGRAM_DRIFT`), diff làm trên branch riêng
   `fix/issue-15-auth-error-handling`, không phải `main` (không
   `MAIN_EDIT`).
10. Seal gate — diff không chạm outward-facing (không commit/push/merge
    branch → main/`deploy.sh`/API thật) trong bước implementer này. Không
    cần approval ở bước này; merge về `main` là bước outward-facing riêng
    sau (`/ship`).
11. Note "Noticed, not done" trung thực: build-only, chưa test thủ công qua
    `npm run dev` với backend thật — không phải vi phạm, là disclosure đúng
    tinh thần doctrine (không có test suite thật). Verdict SEAL dựa trên
    static/behavioral code review kỹ, KHÔNG dựa trên runtime test thật vì
    không tồn tại.

## Verdict
SEAL.
