---
node: issue-15-auth-error-handling
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #15](https://github.com/datvt243/vue-resume-web/issues/15) —
`src/services/auth.js` mix `try/catch` bên ngoài với `.then()/.catch()`
bên trong ở `handleLogin`. `.catch()` bên trong nuốt lỗi nên outer
`try/catch` không bao giờ chạy được (dead code) — silent failure risk.
Có `console.log({err})` debug quên xoá. `handleRegister` cũng dùng
`.then()/.catch()` riêng, không nhất quán với style `async/await` được
khuyến nghị trong project (`CLAUDE.md` → Preferred Patterns).

## Branch
`fix/issue-15-auth-error-handling` (checkout từ `main` trước khi đổi file
— đúng `BranchBeforeCode`).

## Diff
`src/services/auth.js`: refactor cả `handleLogin` và `handleRegister` từ
chuỗi `.then()/.catch()` (kèm outer try/catch chết ở `handleLogin`) sang
thuần `async/await` + `try/catch/finally` — một pattern duy nhất, khớp
proposal trong issue #15.

- `handleLogin`: gộp 3 bước `.then()` (toast success → fetch candidate →
  set store) thành `await` tuần tự trong 1 `try`; xoá `console.log({err})`
  debug; `catch` duy nhất xử lý toast lỗi; `finally` thay cho dòng
  `toValue(loading)?.hide()` đặt sau try/catch cũ (đảm bảo luôn chạy dù
  thành công hay lỗi, giữ đúng hành vi gốc).
- `handleRegister`: cùng pattern — `try { await ... ; toast success ;
  router.push } catch (err) { toast lỗi } finally { hide spinner }`.

Hành vi giữ nguyên 100% so với trước (không đổi API call, không đổi
message/toast, không đổi route đích) — chỉ đổi CÁCH bắt lỗi, không đổi
logic nghiệp vụ.

## Command
```
npm run build
```
(từ repo root, đúng lệnh trong `doctrine/MEMORY.md` — không có lệnh test).

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1339 modules transformed.
...
dist/assets/auth-DExSuvG5.js                         1.17 kB │ gzip:   0.58 kB
...
✓ built in 4.44s
```
Build xanh. Bundle `auth-*.js` giảm từ ~1.48 kB xuống ~1.17 kB (loại bỏ
chuỗi `.then()` lồng nhau + dead code), phù hợp với refactor. Build-only
evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| Không còn outer `try/catch` chết (bị `.catch()` trong nuốt lỗi) | `handleLogin` giờ chỉ có 1 khối `try/catch/finally` duy nhất |
| Xoá `console.log({err})` debug | Không còn trong diff |
| `handleLogin`/`handleRegister` cùng 1 pattern lỗi | Cả 2 đều `try/await.../catch(err){toast}/finally{hide}` |
| Build vẫn xanh | `✓ built in 4.44s` |

## Noticed, not done
- **Chưa test thủ công qua `npm run dev`** cho luồng login/register thật —
  backend (`nodejs-resume-api-ts.onrender.com`) chạy Render free tier, cold
  start ~30s, và cần tài khoản thật để test đăng nhập/đăng ký. Đây là
  build-only verification, KHÔNG phải test hành vi runtime thật. Nếu cần
  chắc chắn 100%, nên test thủ công UI trước khi merge production thật.
- Issue #15 ước lượng "refactor tất cả service files" nhưng chỉ
  `services/auth.js` có pattern mix `try/catch` + `.then()/.catch()` gây
  dead code thật sự (`base.js`/`axios.js` đã dùng `async/await` nhất quán
  từ trước) — không mở rộng scope ra các file khác không có bug tương tự.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
