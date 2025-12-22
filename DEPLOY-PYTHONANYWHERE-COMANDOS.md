# ═══════════════════════════════════════════════════════════════
# 🚀 AI-MAESTRO - COMANDOS PARA DEPLOY NO PYTHONANYWHERE
# ═══════════════════════════════════════════════════════════════

## 📋 INFORMAÇÕES DO PROJETO

🔗 **Repositório GitHub**: https://github.com/maikonthiago/AIMaestro
👤 **Usuário PythonAnywhere**: lobtechsolutions
🌐 **URL PythonAnywhere**: https://lobtechsolutions.pythonanywhere.com
🌐 **Domínio Custom**: https://www.lobtechsolutions.com.br/

## ═══════════════════════════════════════════════════════════════
## 🎯 PARTE 1: DEPLOY INICIAL (Execute no console Bash)
## ═══════════════════════════════════════════════════════════════

# 1. Clonar o repositório
cd ~
git clone https://github.com/maikonthiago/AIMaestro.git
cd AIMaestro

# 2. Criar ambiente virtual
mkvirtualenv --python=/usr/bin/python3.10 aimaestro

# 3. Instalar dependências do backend
cd ~/AIMaestro/backend
pip install -r requirements.txt

# 4. Configurar variáveis de ambiente
cp .env.example .env
nano .env
# IMPORTANTE: Adicione suas API keys:
# - OPENAI_API_KEY=sk-...
# - ANTHROPIC_API_KEY=sk-ant-...
# - SECRET_KEY=seu-secret-key-seguro

# 5. Inicializar banco de dados
python << 'EOF'
from app.database import engine, Base
from app import models
Base.metadata.create_all(bind=engine)
print("✓ Banco de dados criado com sucesso!")
EOF

# 6. Build do frontend (se tiver Node.js instalado)
cd ~/AIMaestro/frontend
npm install
npm run build

## ═══════════════════════════════════════════════════════════════
## 🎯 PARTE 2: CONFIGURAR WEB APP (No painel Web)
## ═══════════════════════════════════════════════════════════════

# Acesse: https://www.pythonanywhere.com/user/lobtechsolutions/webapps/

# 1. Clique em "Add a new web app"
# 2. Escolha: "Manual configuration" (não escolha Flask/Django)
# 3. Selecione: Python 3.10

## ═══════════════════════════════════════════════════════════════
## 🎯 PARTE 3: CONFIGURAR ARQUIVO WSGI
## ═══════════════════════════════════════════════════════════════

# No painel Web, edite o arquivo WSGI:
# Caminho: /var/www/lobtechsolutions_pythonanywhere_com_wsgi.py

# Cole este conteúdo:

"""
import sys
import os

# Adicionar o projeto ao path
project_home = '/home/lobtechsolutions/AIMaestro/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Carregar variáveis de ambiente
from dotenv import load_dotenv
env_path = os.path.join(project_home, '.env')
load_dotenv(env_path)

# Importar aplicação
from app.main import app as application
"""

## ═══════════════════════════════════════════════════════════════
## 🎯 PARTE 4: CONFIGURAR PATHS NO PAINEL WEB
## ═══════════════════════════════════════════════════════════════

# No painel Web, configure:

# Code section:
Source code: /home/lobtechsolutions/AIMaestro/backend
Working directory: /home/lobtechsolutions/AIMaestro/backend

# Virtualenv section:
Virtualenv: /home/lobtechsolutions/.virtualenvs/aimaestro

# Static files section:
URL: /static/
Directory: /home/lobtechsolutions/AIMaestro/frontend/dist

URL: /assets/
Directory: /home/lobtechsolutions/AIMaestro/frontend/dist/assets

## ═══════════════════════════════════════════════════════════════
## 🎯 PARTE 5: RELOAD E TESTE
## ═══════════════════════════════════════════════════════════════

# 1. No topo do painel Web, clique no botão verde "Reload"
# 2. Aguarde alguns segundos
# 3. Acesse: https://lobtechsolutions.pythonanywhere.com
# 4. Você deve ver a tela de login do AI-Maestro!

## ═══════════════════════════════════════════════════════════════
## 🔄 COMANDOS PARA ATUALIZAÇÃO FUTURA
## ═══════════════════════════════════════════════════════════════

# Execute quando fizer mudanças no código:

cd ~/AIMaestro
git pull origin main

# Ativar ambiente virtual
workon aimaestro

# Atualizar dependências (se necessário)
cd ~/AIMaestro/backend
pip install -r requirements.txt

# Rebuild frontend (se mudou o frontend)
cd ~/AIMaestro/frontend
npm run build

# Depois: Clique em "Reload" no painel Web

## ═══════════════════════════════════════════════════════════════
## 🐛 TROUBLESHOOTING
## ═══════════════════════════════════════════════════════════════

# Ver logs de erro:
tail -100 ~/logs/error.log

# Ver logs de acesso:
tail -100 ~/logs/access.log

# Testar se o Python está encontrando os módulos:
workon aimaestro
python << 'EOF'
import sys
print("Python path:")
for p in sys.path:
    print(f"  {p}")
    
print("\nTentando importar app...")
sys.path.insert(0, '/home/lobtechsolutions/AIMaestro/backend')
from app.main import app
print("✓ Import OK!")
EOF

# Reiniciar banco de dados (CUIDADO: apaga todos os dados):
cd ~/AIMaestro/backend
python << 'EOF'
from app.database import engine, Base
from app import models
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Banco reiniciado")
EOF

## ═══════════════════════════════════════════════════════════════
## 🌐 CONFIGURAR DOMÍNIO CUSTOM (lobtechsolutions.com.br)
## ═══════════════════════════════════════════════════════════════

# 1. No painel Web, vá em "Configuration for your web app"
# 2. Adicione domínio em "CNAME setup"
# 3. Configure DNS do seu domínio:
#    CNAME: www.lobtechsolutions.com.br -> lobtechsolutions.pythonanywhere.com
# 4. Aguarde propagação do DNS (até 48h)
# 5. Ative HTTPS gratuito no painel Web

## ═══════════════════════════════════════════════════════════════
## ✅ CHECKLIST FINAL
## ═══════════════════════════════════════════════════════════════

☐ Repositório clonado
☐ Ambiente virtual criado
☐ Dependências instaladas
☐ Arquivo .env configurado com API keys
☐ Banco de dados inicializado
☐ Frontend compilado
☐ Arquivo WSGI configurado
☐ Paths configurados no painel Web
☐ Virtualenv configurado no painel Web
☐ Static files configurados
☐ Botão "Reload" clicado
☐ Aplicação acessível em https://lobtechsolutions.pythonanywhere.com
☐ Login funcionando
☐ Criação de agente funcionando
☐ Chat funcionando

## ═══════════════════════════════════════════════════════════════
## 📞 SUPORTE
## ═══════════════════════════════════════════════════════════════

🐛 Issues: https://github.com/maikonthiago/AIMaestro/issues
📖 Docs: https://github.com/maikonthiago/AIMaestro
📧 Email: suporte@lobtechsolutions.com.br

## ═══════════════════════════════════════════════════════════════
## 🎉 PARABÉNS!
## ═══════════════════════════════════════════════════════════════

Se tudo funcionou, seu AI-Maestro está rodando em produção! 🚀

Próximos passos:
1. Registrar um usuário
2. Criar seu primeiro agente
3. Testar o chat
4. Adicionar documentos (RAG)
5. Explorar analytics

Boa sorte! 🎯
