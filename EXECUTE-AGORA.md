# 🚀 COMANDOS ESSENCIAIS PARA VOCÊ EXECUTAR AGORA

## ═══════════════════════════════════════════════════════════
## 📦 PARTE 1: CONFIGURAÇÃO NO PYTHONANYWHERE
## ═══════════════════════════════════════════════════════════

### 1. Acesse o PythonAnywhere
```
URL: https://www.pythonanywhere.com/user/lobtechsolutions/
```

### 2. Abra um Console Bash
```
Vá em: Consoles → Bash
```

### 3. Execute estes comandos NO CONSOLE BASH:

```bash
# Clone o repositório
cd ~
git clone https://github.com/maikonthiago/AIMaestro.git
cd AIMaestro

# Criar ambiente virtual
mkvirtualenv --python=/usr/bin/python3.10 aimaestro

# Instalar dependências
cd ~/AIMaestro/backend
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
nano .env
```

**IMPORTANTE**: No editor nano, adicione suas API keys:
```env
OPENAI_API_KEY=sua-chave-aqui
ANTHROPIC_API_KEY=sua-chave-aqui
SECRET_KEY=mude-para-algo-seguro
```

Salvar: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Inicializar banco de dados
python << 'EOF'
from app.database import engine, Base
from app import models
Base.metadata.create_all(bind=engine)
print("✓ Banco criado!")
EOF
```

## ═══════════════════════════════════════════════════════════
## 📦 PARTE 2: CONFIGURAR WEB APP (NO PAINEL)
## ═══════════════════════════════════════════════════════════

### 4. Vá para a seção Web
```
URL: https://www.pythonanywhere.com/user/lobtechsolutions/webapps/
```

### 5. Clique em "Add a new web app"
- Choose: **Manual configuration**
- Python version: **3.10**

### 6. Configure os campos:

**Code section:**
```
Source code: /home/lobtechsolutions/AIMaestro/backend
Working directory: /home/lobtechsolutions/AIMaestro/backend
```

**Virtualenv section:**
```
Virtualenv: /home/lobtechsolutions/.virtualenvs/aimaestro
```

### 7. Edite o arquivo WSGI

Clique no link do arquivo WSGI (algo como `/var/www/lobtechsolutions_pythonanywhere_com_wsgi.py`)

**Apague todo o conteúdo** e cole isto:

```python
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
```

Salve o arquivo.

### 8. Configure Static Files

Na seção "Static files", adicione:

**URL:** `/static/`  
**Directory:** `/home/lobtechsolutions/AIMaestro/frontend/dist`

(Nota: O frontend precisa ser compilado localmente e enviado, ou você pode fazer isso depois)

### 9. Clique no botão verde "Reload" no topo

## ═══════════════════════════════════════════════════════════
## ✅ PARTE 3: TESTAR
## ═══════════════════════════════════════════════════════════

### 10. Acesse sua aplicação:
```
https://lobtechsolutions.pythonanywhere.com
```

Você deve ver a API funcionando!

### Para testar a API:
```
https://lobtechsolutions.pythonanywhere.com/health
https://lobtechsolutions.pythonanywhere.com/api/docs
```

## ═══════════════════════════════════════════════════════════
## 🎨 PARTE 4: FRONTEND (OPCIONAL - COMPILAR LOCALMENTE)
## ═══════════════════════════════════════════════════════════

Se quiser o frontend funcionando, execute na sua máquina local:

```bash
cd AIMaestro/frontend
npm install
npm run build
```

Depois, envie a pasta `dist` para o PythonAnywhere usando o painel Files:
```
Upload para: /home/lobtechsolutions/AIMaestro/frontend/dist/
```

## ═══════════════════════════════════════════════════════════
## 🔄 COMANDOS ÚTEIS FUTUROS
## ═══════════════════════════════════════════════════════════

### Atualizar código depois de mudanças no GitHub:
```bash
cd ~/AIMaestro
git pull origin main
workon aimaestro
pip install -r backend/requirements.txt
```

Depois: Clique em "Reload" no painel Web

### Ver logs se algo der errado:
```bash
tail -100 ~/logs/error.log
```

### Reiniciar banco de dados (CUIDADO: apaga tudo):
```bash
cd ~/AIMaestro/backend
python << 'EOF'
from app.database import engine, Base
from app import models
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Banco reiniciado")
EOF
```

## ═══════════════════════════════════════════════════════════
## 🆘 PROBLEMAS COMUNS
## ═══════════════════════════════════════════════════════════

### Erro 502:
```bash
# Ver o que está errado:
tail -50 ~/logs/error.log
```

### Módulo não encontrado:
```bash
# Reinstalar dependências:
cd ~/AIMaestro/backend
workon aimaestro
pip install -r requirements.txt --force-reinstall
```

### Erro de import:
- Verifique se o caminho no WSGI está correto
- Verifique se o virtualenv está correto no painel Web

## ═══════════════════════════════════════════════════════════
## 📞 PRECISA DE AJUDA?
## ═══════════════════════════════════════════════════════════

- **GitHub**: https://github.com/maikonthiago/AIMaestro
- **Documentação completa**: Ver arquivos .md no repositório
- **Issues**: https://github.com/maikonthiago/AIMaestro/issues

## ═══════════════════════════════════════════════════════════
## ✨ RESUMO DO QUE VOCÊ TEM
## ═══════════════════════════════════════════════════════════

✅ Sistema completo de Agentes de IA
✅ Backend FastAPI com autenticação
✅ Frontend React (precisa compilar)
✅ RAG para documentos
✅ Chat com múltiplos LLMs
✅ Analytics
✅ Multi-tenant (SaaS)
✅ API REST documentada

**Repositório**: https://github.com/maikonthiago/AIMaestro

---

🚀 **Siga os passos acima e sua aplicação estará no ar!**
