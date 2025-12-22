# 🚀 Guia de Teste Local - AI Maestro

## Pré-requisitos

- Python 3.9 ou superior
- Node.js 16 ou superior
- npm ou yarn

## Passo 1: Backend (API)

### 1.1 Navegar para a pasta backend
```bash
cd /home/thiagolobopersonaltrainer/AIMaestro/backend
```

### 1.2 Criar ambiente virtual Python
```bash
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Instalar dependências
```bash
pip install -r requirements.txt
```

### 1.4 Configurar variáveis de ambiente
```bash
cat > .env << 'EOF'
# Banco de dados
DATABASE_URL=sqlite:///./ai_maestro.db

# Segurança
SECRET_KEY=sua-chave-secreta-super-segura-mude-isso-123456789
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# APIs de IA (opcional para teste básico)
OPENAI_API_KEY=sk-seu-token-aqui
ANTHROPIC_API_KEY=sk-ant-seu-token-aqui
GOOGLE_API_KEY=seu-token-google-aqui
EOF
```

### 1.5 Criar super admin
```bash
python scripts/create_superadmin.py
```

### 1.6 Iniciar o backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend rodando em: http://localhost:8000**
📚 **Documentação da API: http://localhost:8000/api/docs**

---

## Passo 2: Frontend (React)

### 2.1 Abrir novo terminal e navegar para frontend
```bash
cd /home/thiagolobopersonaltrainer/AIMaestro/frontend
```

### 2.2 Instalar dependências
```bash
npm install
```

### 2.3 Iniciar o frontend
```bash
npm run dev
```

✅ **Frontend rodando em: http://localhost:5173**

---

## Passo 3: Acessar o Sistema

### 3.1 Landing Page
```
URL: http://localhost:5173
```

### 3.2 Fazer Login como Super Admin
```
URL: http://localhost:5173/login

Credenciais:
Username: thiagolobo
Password: #Wolf@1902
```

### 3.3 Acessar o Dashboard
```
URL: http://localhost:5173/app
```

### 3.4 Acessar Painel Admin
```
URL: http://localhost:5173/app/admin
```

---

## 🎯 Comandos Rápidos (Resumo)

### Terminal 1 - Backend
```bash
cd /home/thiagolobopersonaltrainer/AIMaestro/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend
```bash
cd /home/thiagolobopersonaltrainer/AIMaestro/frontend
npm run dev
```

---

## 📋 Recursos Disponíveis

### Páginas Públicas
- `/` - Landing page
- `/login` - Login
- `/register` - Cadastro

### Páginas Autenticadas (após login)
- `/app` - Dashboard
- `/app/agents` - Listagem de agentes
- `/app/agents/new` - Criar novo agente
- `/app/agents/:id/edit` - Editar agente
- `/app/agents/:id/chat` - Chat com agente
- `/app/analytics` - Analytics
- `/app/settings` - Configurações
- `/app/admin` - Painel Admin (apenas super admin)

### API Endpoints
- `GET /health` - Health check
- `GET /api/docs` - Documentação Swagger
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual
- `GET /api/agents` - Listar agentes
- `POST /api/agents` - Criar agente
- `POST /api/chat/` - Enviar mensagem
- `GET /api/admin/stats` - Estatísticas (super admin)
- E muito mais...

---

## 🧪 Testando Funcionalidades

### 1. Criar um Usuário Normal
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "username": "usuario_teste",
    "password": "senha123456",
    "full_name": "Usuário Teste"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=thiagolobo&password=%23Wolf%401902"
```

### 3. Verificar Health
```bash
curl http://localhost:8000/health
```

### 4. Ver Estatísticas Admin
```bash
# Primeiro faça login e pegue o token, depois:
curl http://localhost:8000/api/admin/stats \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError"
```bash
# Certifique-se que o venv está ativado
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### Erro: "Port already in use"
```bash
# Backend (porta 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (porta 5173)
lsof -ti:5173 | xargs kill -9
```

### Erro: "CORS" no frontend
```bash
# Verifique se o backend está rodando em http://localhost:8000
# Verifique o ALLOWED_ORIGINS no backend/.env
```

### Banco de dados corrompido
```bash
# Deletar e recriar
rm backend/ai_maestro.db
python backend/scripts/create_superadmin.py
```

---

## 📝 Notas

- **APIs de IA são opcionais** para teste local. O sistema funciona sem elas, mas não conseguirá gerar respostas dos agentes
- O banco SQLite será criado automaticamente em `backend/ai_maestro.db`
- O super admin é criado automaticamente pelo script
- Para desenvolvimento, use `--reload` no uvicorn para hot reload

---

## 🎨 Próximos Passos

1. ✅ Testar landing page
2. ✅ Testar login/registro
3. ✅ Criar um agente
4. ✅ Testar chat (precisa de API keys)
5. ✅ Acessar painel admin
6. ✅ Gerenciar usuários no admin

**Boa sorte! 🚀**
