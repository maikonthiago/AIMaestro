#!/bin/bash

echo "🚀 Script de Deploy para PythonAnywhere"
echo "========================================"

# Configurações
REPO_URL="https://github.com/maikonthiago/AIMaestro.git"
PROJECT_DIR="$HOME/AIMaestro"
VENV_NAME="aimaestro"

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Clonando/Atualizando repositório...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    git pull origin main
else
    cd ~
    git clone "$REPO_URL"
fi

echo -e "${GREEN}✓ Repositório atualizado${NC}"

echo -e "${YELLOW}2. Configurando ambiente virtual...${NC}"
if [ ! -d "$HOME/.virtualenvs/$VENV_NAME" ]; then
    mkvirtualenv --python=/usr/bin/python3.10 "$VENV_NAME"
else
    workon "$VENV_NAME"
fi

echo -e "${GREEN}✓ Ambiente virtual configurado${NC}"

echo -e "${YELLOW}3. Instalando dependências do backend...${NC}"
cd "$PROJECT_DIR/backend"
pip install -r requirements.txt

echo -e "${GREEN}✓ Dependências do backend instaladas${NC}"

echo -e "${YELLOW}4. Configurando banco de dados...${NC}"
python << EOF
from app.database import engine, Base
from app import models
Base.metadata.create_all(bind=engine)
print("Banco de dados inicializado")
EOF

echo -e "${GREEN}✓ Banco de dados configurado${NC}"

echo -e "${YELLOW}5. Instalando dependências do frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm install

echo -e "${GREEN}✓ Dependências do frontend instaladas${NC}"

echo -e "${YELLOW}6. Build do frontend para produção...${NC}"
npm run build

echo -e "${GREEN}✓ Frontend compilado${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Configure o arquivo .env em backend/.env"
echo "2. No painel Web do PythonAnywhere, clique em 'Reload'"
echo "3. Acesse sua aplicação em: https://lobtechsolutions.pythonanywhere.com"
echo ""
