# 🎯 INÍCIO RÁPIDO - AI-MAESTRO

## 🚀 Para Desenvolvedores (Local)

### 1. Clone o repositório
```bash
git clone https://github.com/maikonthiago/AIMaestro.git
cd AIMaestro
```

### 2. Configure o Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Copiar e configurar .env
cp .env.example .env
# Edite .env e adicione suas API keys

# Rodar servidor
uvicorn app.main:app --reload
```

Backend rodando em: http://localhost:8000

### 3. Configure o Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

Frontend rodando em: http://localhost:3000

### 4. Primeira Execução

1. Acesse: http://localhost:3000
2. Clique em "Registre-se"
3. Crie sua conta
4. Faça login
5. Crie seu primeiro agente!

## ☁️ Para Deploy (PythonAnywhere)

### Opção 1: Script Automatizado

```bash
# No console Bash do PythonAnywhere
cd ~
git clone https://github.com/maikonthiago/AIMaestro.git
cd AIMaestro
bash deploy-pythonanywhere.sh
```

### Opção 2: Manual

Veja o guia completo em [DEPLOY.md](DEPLOY.md)

## 📚 Documentação

- **README Principal**: [README.md](README.md)
- **Deploy PythonAnywhere**: [DEPLOY.md](DEPLOY.md)
- **Comandos Rápidos**: [COMANDOS-DEPLOY.md](COMANDOS-DEPLOY.md)

## 🎓 Tutorial: Criando seu Primeiro Agente

1. **Login/Registro**
   - Acesse a aplicação
   - Crie uma conta ou faça login

2. **Criar Agente**
   - Clique em "Criar Agente"
   - Preencha:
     - Nome: "Assistente de Vendas"
     - Descrição: "Agente especializado em vendas"
     - Modelo: GPT-4
     - System Prompt: "Você é um assistente de vendas prestativo..."

3. **Testar Agente**
   - Clique no ícone de chat
   - Digite uma mensagem
   - Veja a resposta do agente

4. **Publicar**
   - Volte para a lista de agentes
   - Edite o agente
   - Ative "Publicado"

## 🔑 Configuração de API Keys

### OpenAI
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Adicione no `.env`: `OPENAI_API_KEY=sk-...`

### Anthropic (Claude)
1. Acesse: https://console.anthropic.com/
2. Crie uma chave
3. Adicione no `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

## 🎨 Personalização

### Modificar Cores do Frontend
Edite `frontend/src/main.jsx`:
```javascript
const theme = extendTheme({
  colors: {
    brand: {
      500: '#2196f3',  // Cor principal
      // ...
    }
  }
})
```

### Adicionar Novos Modelos
Edite `backend/app/services/llm.py` e adicione suporte para novos LLMs.

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verificar se as dependências estão instaladas
pip install -r requirements.txt

# Verificar se o .env existe
ls -la backend/.env
```

### Frontend não carrega
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de API Key
- Verifique se o `.env` tem as chaves corretas
- Verifique se as chaves têm créditos

## 📊 Monitoramento

### Ver Logs (Desenvolvimento)
```bash
# Terminal do backend mostra logs automáticos
# Console do navegador mostra erros do frontend
```

### Ver Logs (Produção PythonAnywhere)
```bash
tail -f ~/logs/error.log
tail -f ~/logs/access.log
```

## 🔄 Atualização

### Local
```bash
git pull origin main
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
```

### PythonAnywhere
```bash
cd ~/AIMaestro
git pull origin main
bash deploy-pythonanywhere.sh
# Depois: Reload no painel Web
```

## 💡 Dicas

1. **Use SQLite para desenvolvimento** (padrão)
2. **Use PostgreSQL para produção** (recomendado)
3. **Configure CORS corretamente** no `.env`
4. **Ative HTTPS** no PythonAnywhere
5. **Faça backup** do banco regularmente

## 🆘 Precisa de Ajuda?

- **Issues**: https://github.com/maikonthiago/AIMaestro/issues
- **Documentação**: https://github.com/maikonthiago/AIMaestro
- **API Docs**: http://localhost:8000/api/docs (local)

## 📈 Próximos Passos

1. ✅ Configure o ambiente
2. ✅ Crie seu primeiro agente
3. 🔄 Adicione documentos (RAG)
4. 🔄 Configure workflows
5. 🔄 Conecte canais (WhatsApp, etc)
6. 🔄 Analise métricas

---

**Bom desenvolvimento!** 🚀
