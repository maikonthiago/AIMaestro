#!/bin/bash

# Script para criar e configurar repositório no GitHub

USERNAME="maikonthiago"
TOKEN="SEU_TOKEN_AQUI"  # Substitua pelo seu token do GitHub
REPO_NAME="AIMaestro"

echo "🚀 Configurando repositório GitHub..."

# Criar repositório no GitHub via API
curl -u "$USERNAME:$TOKEN" \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"AI-Maestro - Plataforma SaaS de Agentes de IA com RAG, Chat Multi-Canal e Analytics\",\"private\":false}"

echo ""
echo "✓ Repositório criado no GitHub"

# Adicionar remote
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO_NAME.git"

echo "✓ Remote configurado"

# Renomear branch para main
git branch -M main

echo "✓ Branch renomeada para main"

# Push inicial
git push -u origin main

echo ""
echo "✅ Deploy para GitHub concluído!"
echo "📦 Repositório: https://github.com/$USERNAME/$REPO_NAME"
