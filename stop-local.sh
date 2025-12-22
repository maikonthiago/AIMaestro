#!/bin/bash

# Script para parar o AI Maestro local
# Uso: bash stop-local.sh

echo "=================================="
echo "🛑 Parando AI Maestro..."
echo "=================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Parar backend (porta 8000)
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Parando backend (porta 8000)..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Backend parado${NC}"
else
    echo "Backend não está rodando"
fi

# Parar frontend (porta 5173)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Parando frontend (porta 5173)..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Frontend parado${NC}"
else
    echo "Frontend não está rodando"
fi

# Parar processos uvicorn
pkill -f "uvicorn app.main:app" 2>/dev/null

# Parar processos vite
pkill -f "vite" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Todos os serviços foram parados${NC}"
echo ""
