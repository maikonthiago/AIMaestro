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

# Função para verificar se o frontend já está rodando
check_frontend() {
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Frontend já está rodando na porta 5173${NC}"
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

# Verificar Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

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
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
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
echo -e "${BLUE}📦 Passo 3: Configurando Frontend...${NC}"

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}🚀 Passo 4: Iniciando serviços...${NC}"
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

# Iniciar frontend em background
if ! check_frontend; then
    echo "Iniciando frontend..."
    cd frontend
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    sleep 5
    
    if check_frontend; then
        echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
        echo "   🎨 Interface: http://localhost:5173"
    else
        echo -e "${RED}❌ Erro ao iniciar frontend. Veja logs/frontend.log${NC}"
        exit 1
    fi
fi

echo ""
echo "=================================="
echo -e "${GREEN}✅ AI MAESTRO RODANDO!${NC}"
echo "=================================="
echo ""
echo "📍 URLs:"
echo "   🎨 Frontend:  http://localhost:5173"
echo "   🔧 Backend:   http://localhost:8000"
echo "   📚 API Docs:  http://localhost:8000/api/docs"
echo ""
echo "🔑 Super Admin:"
echo "   Username: thiagolobo"
echo "   Password: #Wolf@1902"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 Para parar os serviços:"
echo "   bash stop-local.sh"
echo ""
echo "=================================="
