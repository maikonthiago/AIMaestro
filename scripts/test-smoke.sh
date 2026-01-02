#!/usr/bin/env bash
set -euo pipefail

PORT="8100"
MAX_WAIT=20

cd "$(dirname "$0")/../backend"

echo "[smoke] garantindo venv..."
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate

if [ ! -f "venv/installed" ]; then
  pip install -q -r requirements.txt
  touch venv/installed
fi

echo "[smoke] iniciando uvicorn na porta ${PORT}..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --log-level warning &
PID=$!
trap 'kill ${PID} 2>/dev/null || true' EXIT

for i in $(seq 1 ${MAX_WAIT}); do
  if curl -sSf "http://127.0.0.1:${PORT}/health" > /dev/null; then
    READY=1
    break
  fi
  sleep 1
done

if [ -z "${READY:-}" ]; then
  echo "[smoke] serviço não subiu em ${MAX_WAIT}s" >&2
  exit 1
fi

echo "[smoke] verificando páginas estáticas..."
endpoints=(
  /
  /login/
  /register/
  /app/
  /app/agents/
  /app/agent-builder/
  /app/chat/
  /app/analytics/
  /app/settings/
  /app/admin/
)

for path in "${endpoints[@]}"; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "http://127.0.0.1:${PORT}${path}")
  if [ "${code}" != "200" ]; then
    echo "[smoke] falha ${path} -> HTTP ${code}" >&2
    exit 1
  fi
  echo "[smoke] ok ${path} (${code})"
done

echo "[smoke] verificando health check..."
code=$(curl -o /dev/null -s -w "%{http_code}" "http://127.0.0.1:${PORT}/health")
if [ "${code}" != "200" ]; then
  echo "[smoke] health check falhou -> HTTP ${code}" >&2
  exit 1
fi

echo "[smoke] testes de fumaça passaram"
