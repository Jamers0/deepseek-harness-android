# Kerberus File Mesh

## Estado atual
A API expõe observação read-only em:
- `/api/v1/files`
- `/api/v1/files/devices`
- `/api/v1/files/shares`
- `/api/v1/files/status`

O estado é `partial` por falta de validação do Motorola e de confirmação do protocolo/shares ativos em cada dispositivo. Não há shares inventados nem operações destrutivas na API.

## Matriz de aceitação
| Sentido | Estado |
|---|---|
| Aspire ↔ S21 | NOT TESTED nesta sessão |
| Aspire ↔ Motorola | BLOCKED: Motorola:8022 recusado |
| S21 ↔ Motorola | BLOCKED: Motorola:8022 recusado |

## Próxima validação exata
1. Recuperar o Motorola na mesh e confirmar `sshd :8022`.
2. Identificar o gestor/protocolo já usado para os shares do Aspire.
3. Criar área controlada de partilha, sem secrets/app data.
4. Testar listar, ler, escrever, copiar pequeno/grande, mídia e reconexão em cada sentido.
5. Só então preencher a matriz com PASS e integrar ações autorizadas na Dashboard.
