> the gate.

# Contract
- Input: path tới một evidence note dưới `evidence/implementer/`.
- Output: `{verdict: SEAL|REOPEN, node, cited: string[], missing: string[],
  forbidden_hit: string|null, pm_updated: boolean}`
- REFUSAL: nếu chính phiên này viết ra diff đang được xét → từ chối ngay:
  "I wrote this, a separate verifier pass is required." (`NeverVerifyOwnWork`)

## Steps
1. TỪ CHỐI TỰ CHẤM TRƯỚC TIÊN — tôi có viết diff này trong phiên này không?
2. Đọc NOTE — chỉ note, KHÔNG tự mở diff ra đọc trực tiếp. (`EvidenceOnly`)
3. Đọc NODE — lấy acceptance criteria từ `haven/diagrams/`, forbidden states
   từ `CLAUDE.md`.
4. Kiểm lệnh trong note có khớp `doctrine/MEMORY.md` không (vd `npm run
   build` từ repo root — dự án này KHÔNG có lệnh test, đừng REOPEN chỉ vì
   thiếu "test pass" khi note đã nói rõ đây là build-only).
5. Kiểm output có bị cắt/che (`...`, "truncated") không → REOPEN nếu có.
6. Đi qua acceptance criteria TỪNG CÁI MỘT — thiếu evidence nào = REOPEN,
   ghi rõ vào "missing".
7. Quét cả 5 forbidden states.
8. Kiểm SEAL GATE — có approval ghi trong note nếu diff outward-facing
   (commit/push/`./deploy.sh`) không.
9. Kiểm tỷ lệ — diff làm nhiều hơn mức node yêu cầu, hoặc tiện tay sửa một
   trap khác chưa được giao trong `doctrine/domains/PROJECT.md` → REOPEN
   (`SmallestDiff`).
10. Phán quyết đúng một trong hai: SEAL (mọi tiêu chí có evidence trích dẫn)
    hoặc REOPEN (chỉ cần MỘT thiếu sót quan trọng nhất).
11. Chỉ khi SEAL: cập nhật ratchet/PM status trong `haven/diagrams/`.
12. Viết verdict vào `evidence/verifier/<date>/<slug>-{seal|reopen}.md`.

## Hard rules honored
`NeverVerifyOwnWork` | `EvidenceOnly` | `VerdictOnly` | `RatchetOnly`

## Failure branches
| Failure | Handling |
|---|---|
| Không có evidence note | REOPEN, `NO_EVIDENCE` |
| Node không tồn tại trên diagram nào | REOPEN, `forbidden_hit: node_unknown` |
| Node đã SEALED rồi | Không ghi đè — phải là node mới |

## Runtime
`/worker verifier "<task hoặc note>"`.
