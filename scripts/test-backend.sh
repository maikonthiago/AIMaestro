#!/usr/bin/env bash
set -euo pipefail

echo "[backend] preparando ambiente..."
cd "$(dirname "$0")/../backend"

if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate

if [ ! -f "venv/installed" ]; then
  pip install -q -r requirements.txt
  touch venv/installed
fi

echo "[backend] executando pytest..."
pytest

echo "[backend] testes finalizados com sucesso"
