---
name: boot
description: Orientation for the vue-resume-web agent-hub. Read NORTHSTAR, doctrine, diagrams, and the most recent evidence notes; report a 6-line status. Use at the very start of every working session on this project, even for small edits. Makes NO changes.
---

# /boot — 60-second orientation for vue-resume-web

Bạn đang đóng vai trò đọc, KHÔNG phải worker. Không sửa bất kỳ file nào
trong bước này — chỉ đọc và báo cáo.

## Steps (đúng thứ tự, không bỏ bước nào)
1. Đọc `agent-hub/NORTHSTAR.md`.
2. Đọc `agent-hub/CLAUDE.md` — nhắc lại 5 forbidden states và seal gate cho
   chính mình.
3. Đọc `agent-hub/doctrine/MEMORY.md` — lấy path repo + lệnh chính xác
   (`npm run build`, `npm run dev`... — KHÔNG có lệnh test).
4. Đọc `agent-hub/doctrine/domains/PROJECT.md` — đặc biệt bảng Traps, đừng
   lặp lại bug đã biết (vd `createMemoryHistory`, GET login lộ password).
5. Đọc mọi file trong `agent-hub/haven/diagrams/` — liệt kê node + PM
   status hiện tại.
6. Đọc `agent-hub/haven/workers/` — xác nhận có đúng 2 worker: implementer,
   verifier.
7. Đọc tối đa 5 evidence note gần nhất (file mới nhất theo ngày) trong
   `agent-hub/evidence/implementer/` và `agent-hub/evidence/verifier/`. Nếu
   thư mục trống, ghi nhận "chưa có evidence note nào".

## Report format — ĐÚNG 6 dòng, không thêm bớt
```
🎯 Northstar: <one sentence từ NORTHSTAR.md>
✅ Forbidden: <none active | tên state đang active nếu có>
📊 Diagrams: <N nodes = X sealed, Y pending, Z in_progress>
🔧 Workers: implementer, verifier
📝 Last action: <node — SEAL|REOPEN, ngày, trích ngắn từ evidence note gần nhất, hoặc "none yet">
🚧 Blockers: <danh sách <<FILL>> còn mở trong doctrine/MEMORY.md hoặc doctrine/domains/PROJECT.md, hoặc "none">
```

## Rules
- KHÔNG re-scan toàn bộ `src/` — doctrine đã có sẵn sự thật cần thiết.
- KHÔNG tự sửa `<<FILL>>` trong lúc `/boot` — chỉ báo cáo là blocker.
- Nếu một file load-bearing (`NORTHSTAR.md`, `doctrine/MEMORY.md`,
  `doctrine/domains/PROJECT.md`, `haven/diagrams/dev-loop.prime-mermaid.md`)
  không đọc được, dừng ngay và báo lỗi thay vì đoán nội dung.
- Sau report, sẵn sàng nhận `/worker implementer "<task>"` hoặc
  `/worker verifier "<task>"` hoặc `/todo "<task>"`.
