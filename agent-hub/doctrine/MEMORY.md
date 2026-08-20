> Nếu bất kỳ tài liệu nào khác mâu thuẫn với file này về path hoặc lệnh,
> FILE NÀY THẮNG. One home per fact — một lệnh sống ở hai file sẽ sai ở một
> trong hai.
>
> Authority: 65537

## What this is
- Hub path (absolute): `/Users/_david/Workspace/Project/ResumeAPI/frontend/agent-hub`
- Code repo path (absolute): `/Users/_david/Workspace/Project/ResumeAPI/frontend`
- Repo remote: `https://github.com/datvt243/vue-resume-web.git`, branch `main`
- Quan hệ hub ↔ repo: chỉ đối chiếu repo qua worker, có kết quả build/run
  thật và evidence note — không bao giờ ad-hoc.

## The exact commands
> COPY these — never type them from memory. Lệnh nhớ trong đầu sẽ trôi, và
> lệnh trôi thì chứng minh sai thứ.

| Purpose | Command | Run from |
|---|---|---|
| Test | **KHÔNG TỒN TẠI** — không có test suite, không có script `test` trong `package.json` (verified). Xem `domains/PROJECT.md` → Traps. | — |
| Test one file | N/A — không có test suite | — |
| Build | `npm run build` (output: `dist/`) | repo root |
| Lint/typecheck | **KHÔNG CHẠY ĐƯỢC** hiện tại — `.eslintrc.cjs` extend `plugin:vue/vue3-essential` nhưng `eslint-plugin-vue` KHÔNG có trong `node_modules` (verified: `ls node_modules/eslint-plugin-vue` → not found), và `package.json` không có script `lint`. `tsc` cũng không có script riêng dù `tsconfig.json` tồn tại. | — |
| Run locally | `npm run dev` → http://localhost:5173 | repo root |
| Preview build | `npm run preview` | repo root |
| Deploy (outward-facing — SEAL GATE) | `./deploy.sh` → GitHub Pages | repo root |

Cho tới khi có test suite thật: điều kiện "done" (3) trong `NORTHSTAR.md`
được thay bằng `npm run build` xanh + kiểm tra thủ công qua `npm run dev` —
implementer PHẢI ghi rõ đây là build-only, không phải test thật.

## Stack
| Thing | Value |
|---|---|
| Language/runtime | Node.js ≥ 18 (theo README) · Vue 3 (Composition API + `<script setup>`) · TypeScript (partial, mixed với `.js`) |
| Package manager | npm (`package-lock.json` là nguồn thật) — LƯU Ý: `yarn.lock` cũng tồn tại song song, đây là trap, xem `domains/PROJECT.md` |
| Build tool | Vite 5, alias `@` → `src/` (khai báo cả `vite.config.ts` lẫn `tsconfig.json`) |
| Test runner | Không có |
| State management | Pinia (`src/stores/auth.js`, `src/stores/candidate.js`) |
| HTTP | Axios (`src/services/axios.js`), base URL từ `src/config/api.config.js` |

## The default way to work
`/boot` → `/worker implementer "<task>"` → `/worker verifier "<task>"`. Không bao
giờ bỏ bước 1 ở phiên nguội, không bao giờ bỏ bước 3.

## Git workflow (bắt buộc, xem `CLAUDE.md` → Branching rule)
- KHÔNG BAO GIỜ sửa/commit trực tiếp trên `main`. Mỗi task → 1 branch riêng
  trước khi đổi bất kỳ file nào, đặt tên theo loại:
  `fix/issue-<n>-<slug>` (bugfix) · `feature/<slug>` (tính năng mới) ·
  `chore/<slug>`/`docs/<slug>` (việc khác).
- Merge branch đó về `main` là hành động outward-facing → qua Seal Gate,
  chờ operator duyệt trước khi merge + push (lệnh `/ship` thực hiện bước
  này sau khi được gọi).
- Sau merge: `fix/*` bị xoá; `feature/*` được GIỮ LẠI; còn lại xoá theo mặc
  định. Xem `.claude/skills/ship/SKILL.md`.
- Evidence note của implementer phải ghi tên branch đã dùng.

## Workers
| wid | Role | Actions | Seal actions |
|---|---|---|---|
| implementer | Implementer | pick_next, implement | — |
| verifier | Verifier | verify_seal | SEAL, REOPEN |

## Forbidden states
6 state — xem chi tiết ở `CLAUDE.md`. Các state này OVERRIDE mọi skill text
khác.

## Facts that are always true
- Không có LLM API key ở đâu trong hub — Claude Code LÀ runtime.
- `haven/` là memory, không phải code.
- `evidence/` được commit; note "xấu" vẫn được giữ lại.
- Ratchet đơn điệu: PENDING → IN_PROGRESS → SEALED, không bao giờ lùi.
- Verifier sở hữu PM status; implementer không bao giờ tự đặt.
- Backend API (`https://nodejs-resume-api-ts.onrender.com/api/v1/`) chạy
  trên Render free tier — cold start ~30s ở lần gọi đầu, đừng nhầm là lỗi.

## Open <<FILL>> values
Không còn `<<FILL>>` nào — mọi lệnh trong bảng trên đã verify trực tiếp từ
`package.json`, `node_modules`, và filesystem thật của repo tại thời điểm
khởi tạo hub (2026-08-20). Nếu `package.json` scripts đổi (vd thêm `lint`
hoặc `test`), sửa bảng trên NGAY và ghi correction vào
`haven/workers/implementer/MEMORY.md`.
