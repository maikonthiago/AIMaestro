#!/bin/bash

# Script para iniciar o AI Maestro localmente
# Uso: bash start-local.sh

echo "=================================="
echo "🚀 AI MAESTRO - Inicialização Local"
echo "=================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -f "README.md" ]; then
    echo -e "${RED}❌ Execute este script da raiz do projeto AI Maestro${NC}"
    exit 1
fi

# Função para verificar se o backend já está rodando
check_backend() {
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Backend já está rodando na porta 8000${NC}"
        return 0
    fi
    return 1
}

echo -e "${BLUE}📦 Passo 1: Verificando dependências...${NC}"

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado. Instale Python 3.9+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python $(python3 --version)${NC}"

echo ""
echo -e "${BLUE}🔧 Passo 2: Configurando Backend...${NC}"

# Criar venv se não existir
if [ ! -d "backend/venv" ]; then
    echo "Criando ambiente virtual Python..."
    cd backend
    python3 -m venv venv
    cd ..
    echo -e "${GREEN}✅ Ambiente virtual criado${NC}"
else
    echo -e "${GREEN}✅ Ambiente virtual já existe${NC}"
fi

# Ativar venv e instalar dependências
echo "Instalando dependências do backend..."
cd backend
source venv/bin/activate

if [ ! -f "venv/installed" ]; then
    pip install -q -r requirements.txt
    touch venv/installed
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

# Criar .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cat > .env << 'EOF'
    DATABASE_URL=sqlite:///./ai_maestro.db
    SECRET_KEY=dev-secret-key-change-in-production-123456789
    ALLOWED_ORIGINS=http://localhost:8000,http://localhost:5173,http://localhost:3000
    OPENAI_API_KEY=your-openai-key-here
    ANTHROPIC_API_KEY=your-anthropic-key-here
    GOOGLE_API_KEY=your-google-key-here
    EOF
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# Criar super admin se não existir banco
if [ ! -f "ai_maestro.db" ]; then
    echo "Criando super admin..."
    python scripts/create_superadmin.py
else
    echo -e "${GREEN}✅ Banco de dados já existe${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}🚀 Passo 3: Iniciando serviços...${NC}"
echo ""

# Iniciar backend em background
if ! check_backend; then
    echo "Iniciando backend..."
    cd backend
    source venv/bin/activate
    nohup uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    sleep 3
    
    if check_backend; then
        echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
        echo "   📚 API Docs: http://localhost:8000/api/docs"
    else
        echo -e "${RED}❌ Erro ao iniciar backend. Veja logs/backend.log${NC}"
        exit 1
    fi
fi

# Criar diretório de logs se não existir
mkdir -p logs

echo -e "${GREEN}✅ Frontend estático pronto em http://localhost:8000${NC}"
echo "   🎨 Interface servida diretamente pelo backend"

echo ""
echo "=================================="
echo -e "${GREEN}✅ AI MAESTRO RODANDO!${NC}"
echo "=================================="
echo ""
echo "📍 URLs:"
echo "   🎨 Frontend:  http://localhost:8000"
echo "   🔧 Backend/API:   http://localhost:8000"
echo "   📚 API Docs:  http://localhost:8000/api/docs"
echo ""
echo "🔑 Super Admin:"
echo "   Username: thiagolobo"
echo "   Password: #Wolf@1902"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend integrado ao backend (sem processo dedicado)"
echo ""
echo "🛑 Para parar os serviços:"
echo "   bash stop-local.sh"
echo ""
echo "=================================="
