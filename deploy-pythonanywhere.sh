#!/bin/bash

# ============================================
# AI-MAESTRO - DEPLOY PYTHONANYWHERE
# ============================================

echo "🚀 AI-Maestro - Deploy PythonAnywhere"
echo "======================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

REPO_URL="https://github.com/maikonthiago/AIMaestro.git"
PROJECT_DIR="/home/lobtechsolutions/AIMaestro"
VENV_NAME="aimaestro"
PYTHON_VERSION="python3.10"

echo -e "${YELLOW}📦 Etapa 1: Clone do repositório${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo "Diretório já existe, fazendo git pull..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    echo "Clonando repositório..."
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi
echo -e "${GREEN}✓ Repositório atualizado${NC}\n"

echo -e "${YELLOW}🐍 Etapa 2: Configuração do ambiente virtual${NC}"
if [ ! -d "/home/lobtechsolutions/.virtualenvs/$VENV_NAME" ]; then
    echo "Criando virtualenv..."
    $PYTHON_VERSION -m venv "/home/lobtechsolutions/.virtualenvs/$VENV_NAME"
fi
source "/home/lobtechsolutions/.virtualenvs/$VENV_NAME/bin/activate"
echo -e "${GREEN}✓ Virtualenv ativado${NC}\n"

echo -e "${YELLOW}📚 Etapa 3: Instalação de dependências do backend${NC}"
cd "$PROJECT_DIR/backend"
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Dependências instaladas${NC}\n"

echo -e "${YELLOW}🗄️ Etapa 4: Configuração do banco de dados${NC}"
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cp "$PROJECT_DIR/backend/.env.example" "$PROJECT_DIR/backend/.env"
    echo "⚠️  Arquivo .env criado - CONFIGURE SUAS CHAVES DE API!"
fi

python << 'PYTHON_SCRIPT'
import sys
sys.path.insert(0, '/home/lobtechsolutions/AIMaestro/backend')

from app.database import engine, Base
from app import models

try:
    Base.metadata.create_all(bind=engine)
    print("✓ Banco de dados inicializado")
except Exception as e:
    print(f"Erro ao criar banco: {e}")
PYTHON_SCRIPT

echo -e "${GREEN}✓ Banco configurado${NC}\n"

echo -e "${YELLOW}🎨 Etapa 5: Build do frontend${NC}"
cd "$PROJECT_DIR/frontend"

# Verificar se npm está disponível
if command -v npm &> /dev/null; then
    echo "Instalando dependências do frontend..."
    npm install
    
    echo "Fazendo build para produção..."
    npm run build
    
    echo -e "${GREEN}✓ Frontend compilado${NC}\n"
else
    echo -e "${RED}⚠️  npm não encontrado. Frontend não será compilado.${NC}"
    echo "   Compile localmente e faça upload da pasta 'dist'"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📝 PRÓXIMOS PASSOS MANUAIS:${NC}"
echo ""
echo "1. Configure o arquivo .env:"
echo "   nano $PROJECT_DIR/backend/.env"
echo "   - Adicione suas API keys (OpenAI, Anthropic, etc)"
echo ""
echo "2. No painel Web do PythonAnywhere:"
echo "   a) Vá em: https://www.pythonanywhere.com/user/lobtechsolutions/webapps/"
echo "   b) Clique em 'Add a new web app'"
echo "   c) Configure:"
echo "      - Framework: Manual configuration"
echo "      - Python version: 3.10"
echo ""
echo "3. Configure o WSGI file:"
echo "   - Caminho: /var/www/lobtechsolutions_pythonanywhere_com_wsgi.py"
echo "   - Conteúdo: Use o arquivo wsgi.py do projeto como referência"
echo ""
echo "4. Configure diretórios:"
echo "   - Source code: $PROJECT_DIR/backend"
echo "   - Working directory: $PROJECT_DIR/backend"
echo "   - Virtualenv: /home/lobtechsolutions/.virtualenvs/$VENV_NAME"
echo ""
echo "5. Configure arquivos estáticos:"
echo "   - URL: /static/"
echo "   - Directory: $PROJECT_DIR/frontend/dist"
echo ""
echo "6. Clique em 'Reload' no topo da página"
echo ""
echo "7. Acesse sua aplicação:"
echo "   https://lobtechsolutions.pythonanywhere.com"
echo ""
echo -e "${YELLOW}📖 Documentação completa: $PROJECT_DIR/DEPLOY.md${NC}"
echo ""
