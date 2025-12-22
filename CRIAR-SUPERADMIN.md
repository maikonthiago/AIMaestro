# Instruções para Criar o Super Admin

## Método 1: Via Script Python (Recomendado)

1. **Ativar ambiente virtual e instalar dependências:**
```bash
cd /home/thiagolobopersonaltrainer/AIMaestro/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Executar o script:**
```bash
python scripts/create_superadmin.py
```

## Método 2: Via API (Depois do Deploy)

1. **Registrar o usuário normalmente via /register**

2. **Conectar ao banco de dados e promover para super admin:**
```bash
# Se usando SQLite (dev)
sqlite3 backend/ai_maestro.db

UPDATE users SET is_superadmin = 1, is_superuser = 1, plan = 'enterprise' 
WHERE username = 'thiagolobo';
```

3. **Se usando PostgreSQL (produção):**
```bash
psql -U seu_usuario -d ai_maestro

UPDATE users SET is_superadmin = true, is_superuser = true, plan = 'enterprise' 
WHERE username = 'thiagolobo';
```

## Método 3: Direto no Código (Para Desenvolvimento)

Edite `backend/app/api/auth.py` temporariamente para criar o primeiro super admin:

```python
# No endpoint de registro, adicione temporariamente:
if user_create.username == "thiagolobo":
    is_superadmin = True
    is_superuser = True
else:
    is_superadmin = False
    is_superuser = False
```

## Credenciais do Super Admin

```
Username: thiagolobo
Password: #Wolf@1902
Email: thiagolobo@aimaestro.com
```

## Acessar o Painel Admin

Depois de fazer login, acesse:
- URL: `/app/admin`
- O link "Admin Panel" aparecerá automaticamente no menu lateral

## Recursos do Admin

- ✅ Visualizar estatísticas do sistema
- ✅ Gerenciar todos os usuários
- ✅ Ativar/desativar usuários
- ✅ Alterar planos de usuários
- ✅ Ver todos os agentes e tenants
- ✅ Atividade recente do sistema
- ✅ Deletar usuários (exceto outros super admins)
