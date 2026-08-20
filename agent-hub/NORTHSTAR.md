---
title: vue-resume-web Northstar
date: 2026-08-20
status: active
authority: 65537
dna: vue_resume_web_hub
---

> Northstar là cái KHÔNG đổi khi mọi thứ khác đổi.

## One sentence
Giữ cho vue-resume-web (Vue 3 SPA quản lý CV cá nhân) tiến triển bằng những
diff nhỏ, đã verify độc lập, không dựa vào trí nhớ phiên hay lời hứa "chắc
là xong".

## What done means
Một node CHỈ được coi là xong khi **TẤT CẢ** (không phải chỉ một trong số)
điều sau đúng:

1. Trace được về đúng một node trên `haven/diagrams/`.
2. Có diff nhỏ nhất khiến node đó đủ điều kiện (không refactor thừa).
3. Đã chạy đúng lệnh test/build của project (từ `doctrine/MEMORY.md`) và ĐỌC
   LẠI output — không suy luận.
4. Có evidence note tại `evidence/<...>/<date>-<slug>.md`.
5. Verifier trả `SEAL` với evidence trích dẫn cụ thể.
6. Bảng PM status trên diagram đã cập nhật khớp.

Thiếu điều (3) hoặc (5) → forbidden state `EDIT_UNVERIFIED`.

> Lưu ý riêng project này: hiện KHÔNG có test suite (`npm test` không tồn
> tại — xem `doctrine/domains/PROJECT.md`). Cho tới khi có test thật, điều
> kiện (3) được thay bằng `npm run build` (build phải xanh) + kiểm tra thủ
> công trên `npm run dev` — ghi rõ trong evidence đây là build-only, không
> phải test thật.

## What this hub does NOT do
- Không tự sửa code ngoài vòng `/worker` rồi commit thẳng → `ADHOC_WORK`
- Không claim "build/tests pass" mà không chạy/đọc lại output thật →
  `EDIT_UNVERIFIED`
- Không để script/code lọt vào `haven/` (nơi đó chỉ là memory) →
  `CODE_IN_HAVEN`
- Không âm thầm sửa code mà không cập nhật PM status trên diagram →
  `DIAGRAM_DRIFT`
- Không thực hiện hành động thật mà không ghi evidence note → `NO_EVIDENCE`

## The success picture (3 months out)
- ≥ 5 recipe trong `haven/workers/*/recipes/` đã được replay ít nhất 1 lần
  (cột "Times replayed" > 0).
- 0 forbidden state trong 20 evidence note gần nhất.
- `doctrine/MEMORY.md` không còn `<<FILL>>` nào ở bảng lệnh chính xác.
- Tất cả 10 trap đã biết trong `doctrine/domains/PROJECT.md` hoặc đã được
  fix (kèm evidence) hoặc vẫn còn nhưng không bị lặp lại do sơ ý.
- Mọi node SEALED trên `haven/diagrams/dev-loop.prime-mermaid.md` đều trỏ
  được tới đúng 1 evidence note verifier.

## Cross-references
`CLAUDE.md` · `doctrine/MEMORY.md` · `haven/diagrams/dev-loop.prime-mermaid.md`
