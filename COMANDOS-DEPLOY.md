# 🚀 COMANDOS RÁPIDOS - PYTHONANYWHERE DEPLOY

## ⚡ Deploy Rápido

```bash
# 1. Conecte via SSH ou use o console Bash do PythonAnywhere

# 2. Execute o script de deploy
cd ~
bash <(curl -s https://raw.githubusercontent.com/maikonthiago/AIMaestro/main/deploy-pythonanywhere.sh)
```

## 🔧 Comandos Úteis

### Atualizar código do repositório
```bash
cd ~/AIMaestro
git pull origin main
```

### Ativar ambiente virtual
```bash
source ~/.virtualenvs/aimaestro/bin/activate
```

### Atualizar dependências
```bash
cd ~/AIMaestro/backend
pip install -r requirements.txt
```

### Rebuild frontend
```bash
cd ~/AIMaestro/frontend
npm install
npm run build
```

### Reiniciar banco de dados
```bash
cd ~/AIMaestro/backend
python << EOF
from app.database import engine, Base
from app import models
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Banco reiniciado")
EOF
```

### Ver logs
```bash
tail -f ~/logs/error.log
tail -f ~/logs/access.log
```

### Testar aplicação localmente
```bash
cd ~/AIMaestro/backend
source ~/.virtualenvs/aimaestro/bin/activate
uvicorn app.main:app --reload
```

## 📦 Estrutura de Diretórios no PythonAnywhere

```
/home/lobtechsolutions/
├── AIMaestro/              # Projeto clonado do Git
│   ├── backend/
│   │   ├── app/
│   │   ├── .env           # Configurações (CRIAR MANUALMENTE)
│   │   └── requirements.txt
│   ├── frontend/
│   │   ├── dist/          # Build do React (após npm run build)
│   │   └── src/
│   └── wsgi.py            # Arquivo WSGI
│
├── .virtualenvs/
│   └── aimaestro/         # Ambiente virtual Python
│
└── logs/                  # Logs do servidor
    ├── error.log
    └── access.log
```

## 🌐 Configuração do Web App

### Arquivo WSGI
**Caminho**: `/var/www/lobtechsolutions_pythonanywhere_com_wsgi.py`

```python
import sys
import os

project_home = '/home/lobtechsolutions/AIMaestro/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

from app.main import app as application
```

### Configurações Web App
- **Source code**: `/home/lobtechsolutions/AIMaestro/backend`
- **Working directory**: `/home/lobtechsolutions/AIMaestro/backend`
- **Virtualenv**: `/home/lobtechsolutions/.virtualenvs/aimaestro`

### Static Files
- **URL**: `/static/`
- **Directory**: `/home/lobtechsolutions/AIMaestro/frontend/dist`

## 🔐 Configuração do .env

Edite o arquivo `.env`:
```bash
nano ~/AIMaestro/backend/.env
```

Adicione suas chaves:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
SECRET_KEY=your-secret-key-change-this
```

## 🔄 Workflow de Atualização

1. **Fazer alterações localmente**
2. **Commit e push**
   ```bash
   git add .
   git commit -m "Descrição das mudanças"
   git push origin main
   ```

3. **Atualizar no PythonAnywhere**
   ```bash
   cd ~/AIMaestro
   git pull origin main
   source ~/.virtualenvs/aimaestro/bin/activate
   pip install -r backend/requirements.txt
   cd frontend && npm run build
   ```

4. **Reload no painel Web**

## 🐛 Troubleshooting

### Erro 502 Bad Gateway
```bash
# Ver logs
tail -f ~/logs/error.log

# Verificar se o virtualenv está ativo
which python

# Reinstalar dependências
cd ~/AIMaestro/backend
pip install -r requirements.txt --force-reinstall
```

### Erro de módulo não encontrado
```bash
# Verificar path no WSGI
# Garantir que sys.path.insert está correto
```

### Banco de dados corrompido
```bash
cd ~/AIMaestro/backend
rm aimaestro.db
python << EOF
from app.database import engine, Base
from app import models
Base.metadata.create_all(bind=engine)
EOF
```

## 📞 Suporte

- GitHub: https://github.com/maikonthiago/AIMaestro
- Issues: https://github.com/maikonthiago/AIMaestro/issues

## 🔗 URLs

- **Aplicação**: https://lobtechsolutions.pythonanywhere.com
- **API Docs**: https://lobtechsolutions.pythonanywhere.com/api/docs
- **Domínio Custom**: https://www.lobtechsolutions.com.br/
