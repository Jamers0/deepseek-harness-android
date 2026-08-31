#!/data/data/com.termux/files/usr/bin/bash
# Sobe os serviços Kerberus no S21 (dashboard Vite + API + code-server no proot Ubuntu)
DASH_DIR="$HOME/Projetos/deepseek-harness-android/kerberus/dashboard"
API_DIR="$HOME/Projetos/deepseek-harness-android/kerberus/api"
LOG="$HOME/kerberus_services.log"
echo "$(date) start_kerberus" >> "$LOG"

# 1) Dashboard Vite (porta 3001)
if ! curl -s -o /dev/null http://127.0.0.1:3001/ ; then
  cd "$DASH_DIR" && nohup pnpm dev >> "$HOME/dash.log" 2>&1 &
  echo "$(date) dashboard subiu" >> "$LOG"
fi

# 2) Kerberus API (porta 3000)
if ! curl -s -o /dev/null http://127.0.0.1:3000/health ; then
  cd "$API_DIR" && nohup node src/index.js >> "$HOME/kerberus-api.log" 2>&1 &
  echo "$(date) api subiu" >> "$LOG"
fi

# 3) code-server no proot Ubuntu (porta 8080)
if ! curl -s -o /dev/null http://127.0.0.1:8080/ ; then
  proot-distro login ubuntu -- code-server --auth password --bind-addr 0.0.0.0:8080 "$DASH_DIR" >> "$HOME/vscode.log" 2>&1 &
  echo "$(date) code-server subiu" >> "$LOG"
fi