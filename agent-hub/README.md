# agent-hub — vue-resume-web

Đây là "bộ nhớ chân cất" của project **vue-resume-web** (Resume/CV
management SPA, Vue 3 + Vite). KHÔNG phải code — đây là markdown thuần:
doctrine (sự thật đã verify), haven (memory + convention của 2 AI worker),
evidence (audit trail). Code thật nằm ở `../src/` như bình thường.

## Triết lý
Trí tuệ không nằm trong model — model là nhân lực thuê theo phiên, reset mỗi
lần mở lại. Trí tuệ nằm trong `doctrine/` (sự thật), `haven/*/recipes/`
(quy trình đã lưu), và `haven/*/MEMORY.md` (craft tích luỹ riêng của từng
worker) — những thứ được LƯU LẠI, không mất khi phiên kết thúc.

## Bắt đầu từ đâu
1. Người mới đọc: `NORTHSTAR.md` → `doctrine/domains/PROJECT.md` → file này.
2. Agent bắt đầu phiên: chạy lệnh `/boot` (không đọc file này thủ công).

## Vòng lặp hằng ngày
```
/boot                              # 60 giây, chỉ đọc, không sửa gì
/worker implementer "<task>"       # implement + evidence note
/worker verifier "<task>"          # SEAL hoặc REOPEN
```
Hoặc gộp 2 lệnh trên: `/todo "<task>"` — vẫn chạy 2 lượt implementer →
verifier tách biệt bên trong, chỉ khác cách gõ lệnh.

## Cấu trúc
```
agent-hub/
├── NORTHSTAR.md, CLAUDE.md, BOOT.md, INDEX.md, README.md
├── doctrine/        # sự thật đã verify
├── haven/           # memory + convention của implementer/verifier
└── evidence/        # audit trail, commit vào git, append-only

.claude/skills/       # harness thật: /boot, /worker, /todo
```

Chi tiết đầy đủ: `INDEX.md` (map file) · `doctrine/domains/PROJECT.md`
(ground truth project) · `doctrine/MEMORY.md` (lệnh chính xác).
