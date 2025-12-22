#!/usr/bin/env python3
"""
Script para criar usuário Super Admin
Uso: python create_superadmin.py
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash


def create_superadmin():
    """Cria o usuário super admin"""
    
    # Dados do super admin
    username = "thiagolobo"
    email = "thiagolobo@aimaestro.com"
    password = "#Wolf@1902"
    full_name = "Thiago Lobo - Super Admin"
    
    print("=" * 60)
    print("Criando Super Admin do AI Maestro")
    print("=" * 60)
    
    # Criar tabelas se não existirem
    print("\n📊 Criando tabelas do banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas/verificadas")
    
    # Criar sessão
    db = SessionLocal()
    
    try:
        # Verificar se já existe
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            print(f"\n⚠️  Usuário já existe!")
            print(f"   Username: {existing_user.username}")
            print(f"   Email: {existing_user.email}")
            print(f"   Super Admin: {existing_user.is_superadmin}")
            
            # Atualizar para super admin se não for
            if not existing_user.is_superadmin:
                print("\n🔄 Atualizando para Super Admin...")
                existing_user.is_superadmin = True
                existing_user.is_superuser = True
                existing_user.is_active = True
                existing_user.plan = "enterprise"
                db.commit()
                print("✅ Usuário atualizado para Super Admin!")
            else:
                print("✅ Usuário já é Super Admin")
            
            return
        
        # Criar novo usuário
        print(f"\n👤 Criando usuário: {username}")
        print(f"   Email: {email}")
        print(f"   Nome: {full_name}")
        
        hashed_password = get_password_hash(password)
        
        superadmin = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_active=True,
            is_superuser=True,
            is_superadmin=True,
            plan="enterprise"
        )
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        
        print("\n" + "=" * 60)
        print("✅ SUPER ADMIN CRIADO COM SUCESSO!")
        print("=" * 60)
        print(f"\n🔑 Credenciais de Acesso:")
        print(f"   Username: {username}")
        print(f"   Password: {password}")
        print(f"   Email: {email}")
        print(f"\n📋 Informações:")
        print(f"   ID: {superadmin.id}")
        print(f"   Plano: {superadmin.plan}")
        print(f"   Super Admin: {superadmin.is_superadmin}")
        print(f"   Super User: {superadmin.is_superuser}")
        print(f"   Ativo: {superadmin.is_active}")
        print("\n💡 Acesse o painel admin em: /app/admin")
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"\n❌ Erro ao criar super admin: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    create_superadmin()
