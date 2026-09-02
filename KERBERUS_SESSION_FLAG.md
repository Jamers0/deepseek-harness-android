# KERBERUS SESSION FLAG

Data: 2026-09-02
Projeto: Kerberus Runtime / DeepSeek Harness Android
Repositorio: /home/jamers0n/media/Projetos/deepseek-harness-android-tmp
Branch: kerberus-v1

## Fase atual do projeto (0–48)
Fases 0–3 de auditoria/correção da camada Kerberus avançadas. Estado global: PARTIAL; não concluir fases físicas/rede sem evidência.

## Objetivo em execução
Auditar e endurecer o Runtime sem tocar no Harness original: API v1 segura, Dashboard por rotas relativas, bootstrap sem FOUC, integração inicial File Mesh read-only e validação real no S21.

## Último ficheiro alterado
`kerberus/docs/KERBERUS_TEST_REPORT.md` e, no código, `kerberus/api/src/index.js`.

## Último commit
`f7d7416 feat(kerberus): harden runtime API and route dashboard services`
Push confirmado em `origin/kerberus-v1`.

## Tarefas concluídas
- Auditoria do documento mestre e fontes de verdade existentes.
- Git auditado; branch `kerberus-v1` confirmado.
- S21 auditado via SSH/Tailscale.
- API, Dashboard, VS Code e SSH reiniciados e verificados no S21.
- API real do S21 preservada: bateria Termux:API, latência, heartbeat, SSH/Tailscale.
- Aliases `/api`, `/api/v1/status`, `/api/v1/runtime`, `/api/v1/services`, `/api/v1/hardware`, `/api/docs`.
- Endpoints read-only `/api/v1/files`, `/devices`, `/shares`, `/status`.
- POST `/tasks` bloqueado sem Bearer configurado.
- Dashboard API relativa + proxy Vite.
- Bootstrap de tema antes da montagem React.
- Links públicos sem IP/porta hardcoded; password do code-server removida da UI.
- Build Dashboard PASS; `node --check` PASS; hooks pre-commit/pre-push PASS.
- Documentos criados em `kerberus/docs/`.

## Tarefas pendentes
- Recuperar Motorola: `100.69.197.122:8022` retorna Connection refused.
- Auditar protocolo/gestor de ficheiros e shares nos três dispositivos.
- Implementar e testar File Mesh bidirecional nos seis sentidos.
- Auditar/configurar reverse proxy real e Cloudflare Access por rota.
- Validar Harness no Motorola e proxy `/harness`.
- Substituir iframe do TerminalPopup por terminal WebSocket/PTTY real ou documentar limitação.
- Configurar `KERBERUS_API_TOKEN` no ambiente seguro do S21 e testar POST autorizado sem expor segredo.
- Testes físicos: reboot, suspensão, troca Wi-Fi/Tailscale, Chrome Android, LAN e domínio público.
- Completar documentação mínima restante do mestre e checklist 0–48.

## Próxima ação exata (primeiro passo)
Executar `ssh motorola-s21 'sshd -p 8022'` apenas depois de confirmar que o dispositivo está online; se continuar recusado, diagnosticar Tailscale/Termux:Boot no Motorola. Não alterar S21 nem File Mesh com suposições.

## Erros encontrados e causa
- Motorola SSH: Connection refused; causa não comprovada, serviço/dispositivo inacessível.
- Advertência Dashboard build: tsconfig-base usa target `es2024` não reconhecido pelo esbuild; build ainda PASS, não corrigir fora de `kerberus/` sem necessidade.
- S21 não possui `git`, `ss` ou `ip` no Termux; sincronização é `tar/scp`, diagnósticos usam ferramentas disponíveis.
- Sem `KERBERUS_API_TOKEN` no S21: POST administrativo responde 503 `AUTH_NOT_CONFIGURED` por desenho seguro.

## Decisões arquitetónicas tomadas
- Todo código novo permanece em `kerberus/`.
- Não tocar em `apps/`, `packages/`, `vendor/` ou `scripts/`.
- Preservar patches Android/Bionic e a API remota enriquecida existente.
- Não inventar shares, protocolo, latência ou estado de dispositivos.
- Bind `0.0.0.0` continua temporariamente no S21 para LAN/Tailscale; só mudar após reverse proxy validado.
- File Mesh permanece `partial` até seis sentidos e operações reais serem testados.
- Nenhuma credencial é gravada no código, UI, Git ou flag.

## Estado dos serviços
| Serviço | Estado real |
|---|---|
| Dashboard | ONLINE no S21 :3001; PID observado 24330 após último restart |
| API | ONLINE no S21 :3000; PID observado 24294 após último restart |
| Harness | NÃO TESTADO no S21; arquitetura indica Motorola :3080 |
| VS Code | ONLINE no S21 :8080; login responde HTTP 302 |
| Tailscale | S21 conectado; peer Aspire alcançável pela API; Motorola não confirmado |
| File Mesh | PARTIAL; endpoints de observação online, transfers não validados |

## Checklist atualizada
- [x] Contexto recuperado
- [x] Git auditado
- [x] S21/Android/Termux auditados
- [x] Dashboard/API/VS Code/SSH verificados no S21
- [x] API v1 e autenticação mínima implementadas
- [x] FOUC bootstrap implementado
- [x] Build e syntax checks
- [x] Documentação e changelog da etapa
- [x] Commit e push
- [ ] Motorola auditado/reposto
- [ ] Reverse proxy e público
- [ ] Harness funcional/proxy
- [ ] Terminal WebSocket/PTTY
- [ ] File Mesh seis sentidos
- [ ] Reboot/suspensão/reconexões
- [ ] LAN e domínio público
- [ ] Checklist integral 0–48

## Observações para evitar retrabalho
- O clone de trabalho é `deepseek-harness-android-tmp`; `DeepSeek Harness/Android-Port-2026-08-23` é outro checkout Android.
- O S21 tem alterações locais historicamente não commitadas na API; a versão enriquecida foi preservada antes do deploy.
- Não usar `dsh restart` durante desenvolvimento.
- Não usar `pkill -f` amplo; obter PID e matar somente processos Kerberus conhecidos.
- Não declarar HTTP 200/build como funcionalidade completa.
- Não marcar File Mesh PASS enquanto Motorola estiver inacessível.
- A senha do code-server não deve voltar para a Dashboard/relatórios.
