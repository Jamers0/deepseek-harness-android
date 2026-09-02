# Kerberus — Auditoria real do S21

Data: 2026-09-02
Fonte: SSH `s21` via Tailscale, HTTP externo e clone `kerberus-v1`.

## Hardware comprovado
- Samsung SM-G991U1 / Galaxy S21 5G
- Snapdragon 888 (SM8350), arm64/aarch64, 8 cores
- Android 15, kernel `5.4.274-qgki-30957850-abG991U1UESJHZB1`
- RAM: 7.19 GiB visíveis ao runtime; swap 3 GiB conforme auditoria anterior
- Bateria observada: 81%, ligado por USB, 33.3 °C via Termux:API
- Sem root; `su`, `setprop` e `git` não disponíveis no Termux

## Serviços observados após reinício controlado
| Serviço | PID observado | Porta | Resultado |
|---|---:|---:|---|
| sshd | 8570 | 8022 | PASS |
| Kerberus API | 24042 | 3000 | PASS |
| Dashboard/Vite | 24089 | 3001 | PASS |
| code-server/proot | 24071/24051 | 8080 | PASS, login 302 |
| Harness | — | 3080 | LIMITAÇÃO: roda no Motorola |
| Motorola sshd | — | 8022 | BLOCKED: Connection refused |

## Correções desta sessão
- Preservada a API real existente do S21, incluindo latência, heartbeat, SSH/Tailscale e bateria Termux:API.
- Adicionados aliases `/api`, `/api/v1/status`, `/api/v1/runtime`, `/api/v1/services`, `/api/v1/hardware` e `/api/docs`.
- Adicionados endpoints read-only `/api/v1/files*`, explicitamente `partial` enquanto os shares/protocolo não forem comprovados nos três dispositivos.
- `POST /tasks` passou a exigir Bearer configurado; sem token responde `503 AUTH_NOT_CONFIGURED`, token inválido responde `401`.
- Dashboard passou a consumir API por rotas relativas e proxy Vite, sem hardcode de IP/porta em links de utilizador.
- Bootstrap de tema executado antes da montagem React para eliminar FOUC no carregamento normal.
- Removida da UI a password do code-server.

## Limitações e divergências
- Bind `0.0.0.0` permanece nos serviços para acesso Tailscale/LAN; isto só deve ser substituído quando o reverse proxy real estiver configurado e validado.
- Não existe reverse proxy local comprovado nesta auditoria.
- Motorola está offline/inacessível; File Mesh não pode ser marcado como OK.
- Reboot, suspensão, troca de Wi-Fi e teste Chrome Android exigem observação física/cliente externo; não foram inventados.
