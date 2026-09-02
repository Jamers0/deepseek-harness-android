# Kerberus — Relatório de testes

Data: 2026-09-02

| Teste | Ambiente | Resultado | Evidência |
|---|---|---|---|
| API `/api/v1/status` | S21/Tailscale | PASS | HTTP 200 |
| API `/api/v1/runtime` | S21/Tailscale | PASS | HTTP 200 |
| API `/api/v1/services` | S21/Tailscale | PASS | HTTP 200 |
| API `/api/v1/hardware` | S21/Tailscale | PASS | HTTP 200; métricas reais |
| File Mesh endpoints | S21/Tailscale | PARTIAL | HTTP 200; estado declarado partial |
| POST `/tasks` sem token | local + S21 | PASS | 503 `AUTH_NOT_CONFIGURED` |
| POST `/tasks` token inválido | local | PASS | HTTP 401 |
| POST `/tasks` token válido | local | PASS | HTTP 202 |
| Dashboard | S21/Tailscale | PASS | HTTP 200 |
| VS Code | S21/Tailscale | PASS | HTTP 302 para `/login` |
| Dashboard build | Aspire | PASS | `pnpm build`, 48 módulos |
| API syntax | Aspire | PASS | `node --check` |
| Motorola SSH | Tailscale | BLOCKED | Connection refused |
| Reboot real | S21 | NOT TESTED | não executado nesta etapa |
| Suspensão/Wi-Fi | S21 | NOT TESTED | requer teste físico |
| LAN | — | NOT TESTED | sem evidência desta sessão |
| Público/Cloudflare | — | NOT TESTED | sem evidência desta sessão |
