# Deploy no PythonAnywhere

Este guia mostra como fazer deploy do AI-Maestro no PythonAnywhere.

## 📋 Pré-requisitos

- Conta no [PythonAnywhere](https://www.pythonanywhere.com)
- Repositório Git do projeto

## 🚀 Passo a Passo

### 1. Clone o repositório

No console Bash do PythonAnywhere:

```bash
cd ~
git clone https://github.com/maikonthiago/AIMaestro.git
cd AIMaestro
```

### 2. Configure o Backend

```bash
cd backend

# Criar ambiente virtual
mkvirtualenv --python=/usr/bin/python3.10 aimaestro

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
nano .env  # Edite com suas configurações
```

### 3. Configure o arquivo WSGI

Crie um arquivo `/var/www/lobtechsolutions_pythonanywhere_com_wsgi.py`:

```python
import sys
import os

# Adicionar o projeto ao path
path = '/home/lobtechsolutions/AIMaestro/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv(os.path.join(path, '.env'))

# Importar a aplicação
from app.main import app as application
```

### 4. Configure a Web App

No painel Web do PythonAnywhere:

1. Clique em "Add a new web app"
2. Escolha "Manual configuration"
3. Selecione Python 3.10
4. Configure:
   - Source code: `/home/lobtechsolutions/AIMaestro/backend`
   - Working directory: `/home/lobtechsolutions/AIMaestro/backend`
   - WSGI file: `/var/www/lobtechsolutions_pythonanywhere_com_wsgi.py`
   - Virtualenv: `/home/lobtechsolutions/.virtualenvs/aimaestro`

### 5. Configure Static Files

No painel Web:

- URL: `/static/`
- Directory: `/home/lobtechsolutions/AIMaestro/frontend/dist`

### 6. Build do Frontend

```bash
cd ~/AIMaestro/frontend

# Instalar dependências
npm install

# Build para produção
npm run build
```

### 7. Configure o Domínio

No painel Web, em "Force HTTPS", ative a opção.

Para usar um subpath:

1. Vá em Web → Your web apps
2. Configure o path `/aimaestro` para apontar para a aplicação

### 8. Inicializar o Banco de Dados

```bash
cd ~/AIMaestro/backend
python << EOF
from app.database import engine, Base
from app.models import *
Base.metadata.create_all(bind=engine)
EOF
```

### 9. Reload da Aplicação

No painel Web, clique em "Reload" no canto superior direito.

## 🔄 Atualização

Para atualizar a aplicação:

```bash
cd ~/AIMaestro
git pull origin main

# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm run build

# Reload no painel Web
```

## 🔧 Configurações Específicas

### Usar PostgreSQL (recomendado para produção)

```bash
# No .env
DATABASE_URL=postgresql://username:password@host/database
```

### Configurar Domínio Customizado

1. No painel Web, adicione seu domínio em "Add a new web app"
2. Configure DNS do seu domínio para apontar para PythonAnywhere
3. Ative HTTPS gratuito via Let's Encrypt

### Logs

Ver logs de erro:
```bash
tail -f ~/logs/error.log
tail -f ~/logs/access.log
```

## 🆘 Troubleshooting

### Erro 502

- Verifique se o virtualenv está ativo
- Verifique se todas as dependências estão instaladas
- Veja os logs de erro

### Erro de Import

- Verifique se o path no WSGI está correto
- Verifique se o virtualenv está configurado corretamente

### Banco de Dados

- Verifique se a DATABASE_URL está correta
- Verifique permissões do arquivo SQLite (se usar)

## 📝 Notas

- PythonAnywhere tem limite de requests no plano gratuito
- Para produção, recomenda-se plano pago
- Configure backups automáticos do banco de dados

## 🔗 Links Úteis

- [Documentação PythonAnywhere](https://help.pythonanywhere.com/)
- [Deploy Flask/FastAPI](https://help.pythonanywhere.com/pages/Flask/)

---

Configurado para: https://www.pythonanywhere.com/user/lobtechsolutions/
Domínio: https://www.lobtechsolutions.com.br/
