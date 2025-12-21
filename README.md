# AI-Maestro - Plataforma SaaS de Agentes de IA

![AI-Maestro](https://img.shields.io/badge/AI-Maestro-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Python](https://img.shields.io/badge/Python-3.9+-blue)

## 🚀 Sobre o Projeto

AI-Maestro é uma plataforma SaaS completa para criação e gerenciamento de agentes de IA com capacidades avançadas de RAG (Retrieval Augmented Generation), workflows personalizáveis e analytics em tempo real.

### ✨ Funcionalidades Principais

- 🤖 **Agent Builder Visual** - Crie agentes de IA sem código
- 💬 **Chat Multi-Canal** - Webchat, WhatsApp, Telegram, API
- 📚 **RAG Avançado** - Base de conhecimento com upload de documentos
- 📊 **Analytics em Tempo Real** - Métricas detalhadas de performance
- 🔄 **Workflows Personalizáveis** - Automatize tarefas complexas
- 🎨 **Marketplace de Skills** - Biblioteca de capacidades reutilizáveis
- 🔐 **Multi-Tenant** - Suporte completo para SaaS
- 🎯 **Múltiplos LLMs** - GPT-4, Claude, Gemini

## 📋 Pré-requisitos

- Python 3.9+
- Node.js 18+
- PostgreSQL (opcional, usa SQLite por padrão)
- Redis (opcional)

## 🔧 Instalação

### Backend (FastAPI)

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Rodar o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend

# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentação da API: http://localhost:8000/api/docs

## 🌍 Deploy

### PythonAnywhere

Veja as instruções completas em [DEPLOY.md](DEPLOY.md)

## 📚 Estrutura do Projeto

```
AIMaestro/
├── backend/
│   ├── app/
│   │   ├── api/          # Rotas da API
│   │   ├── services/     # Serviços (LLM, RAG)
│   │   ├── models.py     # Modelos do banco
│   │   ├── schemas.py    # Schemas Pydantic
│   │   ├── auth.py       # Autenticação
│   │   └── main.py       # App principal
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── stores/       # Estado global
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🎯 Roadmap

### MVP (Fase 1) ✅
- [x] Autenticação e multi-tenant
- [x] Agent Builder básico
- [x] Chat web
- [x] RAG com upload
- [x] API REST completa

### V1 (Fase 2) 🚧
- [ ] Workflow visual
- [ ] Simulador de usuários
- [ ] WhatsApp / Telegram
- [ ] Marketplace de Skills
- [ ] Analytics avançado

### Enterprise (Fase 3) 📋
- [ ] Multi-agente colaborativo
- [ ] Voz (STT/TTS)
- [ ] SDKs
- [ ] White-label
- [ ] Governança completa

## 💰 Planos

| Plano | Preço | Agentes | Mensagens |
|-------|-------|---------|-----------|
| Starter | R$ 97/mês | 1 | 1.000 |
| Pro | R$ 297/mês | 5 | 10.000 |
| Business | R$ 697/mês | Ilimitado | 100.000 |
| Enterprise | Sob consulta | Ilimitado | Ilimitado |

## 🔑 Variáveis de Ambiente

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/aimaestro

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=your-openai-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-key

# Google
GOOGLE_API_KEY=your-google-key
```

## 🧪 Testes

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 📖 Documentação da API

Após iniciar o backend, acesse:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Thiago Lobo** - [LobTech Solutions](https://www.lobtechsolutions.com.br)

## 🆘 Suporte

Para suporte, envie um email para suporte@lobtechsolutions.com.br

## 🙏 Agradecimentos

- OpenAI pela API GPT
- Anthropic pela API Claude
- Comunidade FastAPI e React

---

Feito com ❤️ por [LobTech Solutions](https://www.lobtechsolutions.com.br)
