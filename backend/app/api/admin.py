"""Rotas de administração (super admin)"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Agent, Tenant, Conversation, Message
from app.schemas import UserResponse
from datetime import datetime, timedelta
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["admin"])


def get_superadmin_user(current_user: User = Depends(get_current_user)):
    """Verifica se o usuário é super administrador"""
    if not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Acesso negado. Apenas super administradores.")
    return current_user


@router.get("/stats")
async def get_system_stats(
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Estatísticas gerais do sistema"""
    
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_tenants = db.query(Tenant).count()
    total_agents = db.query(Agent).count()
    total_conversations = db.query(Conversation).count()
    total_messages = db.query(Message).count()
    
    # Usuários por plano
    users_by_plan = db.query(
        User.plan,
        func.count(User.id)
    ).group_by(User.plan).all()
    
    # Novos usuários nos últimos 30 dias
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_30d = db.query(User).filter(User.created_at >= thirty_days_ago).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "new_30d": new_users_30d,
            "by_plan": {plan: count for plan, count in users_by_plan}
        },
        "tenants": {
            "total": total_tenants
        },
        "agents": {
            "total": total_agents
        },
        "conversations": {
            "total": total_conversations
        },
        "messages": {
            "total": total_messages
        }
    }


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Lista todos os usuários do sistema"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Detalhes de um usuário específico"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.patch("/users/{user_id}/activate")
async def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Ativa um usuário"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.is_active = True
    db.commit()
    
    return {"message": "Usuário ativado com sucesso"}


@router.patch("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Desativa um usuário"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user.is_superadmin:
        raise HTTPException(status_code=403, detail="Não é possível desativar um super admin")
    
    user.is_active = False
    db.commit()
    
    return {"message": "Usuário desativado com sucesso"}


@router.patch("/users/{user_id}/plan")
async def change_user_plan(
    user_id: int,
    plan: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Altera o plano de um usuário"""
    if plan not in ["starter", "pro", "business", "enterprise"]:
        raise HTTPException(status_code=400, detail="Plano inválido")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    user.plan = plan
    db.commit()
    
    return {"message": f"Plano alterado para {plan} com sucesso"}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_superadmin_user)
):
    """Deleta um usuário do sistema"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user.is_superadmin:
        raise HTTPException(status_code=403, detail="Não é possível deletar um super admin")
    
    if user.id == current_admin.id:
        raise HTTPException(status_code=403, detail="Não é possível deletar a si mesmo")
    
    db.delete(user)
    db.commit()
    
    return {"message": "Usuário deletado com sucesso"}


@router.get("/agents")
async def list_all_agents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Lista todos os agentes do sistema"""
    agents = db.query(Agent).offset(skip).limit(limit).all()
    return agents


@router.get("/tenants")
async def list_all_tenants(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Lista todos os tenants do sistema"""
    tenants = db.query(Tenant).offset(skip).limit(limit).all()
    return tenants


@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 50,
    db: Session = Depends(get_db),
    _: User = Depends(get_superadmin_user)
):
    """Atividades recentes no sistema"""
    
    # Usuários recentes
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
    
    # Agentes recentes
    recent_agents = db.query(Agent).order_by(Agent.created_at.desc()).limit(limit).all()
    
    # Conversas recentes
    recent_conversations = db.query(Conversation).order_by(Conversation.created_at.desc()).limit(limit).all()
    
    return {
        "recent_users": [
            {"id": u.id, "username": u.username, "email": u.email, "created_at": u.created_at}
            for u in recent_users
        ],
        "recent_agents": [
            {"id": a.id, "name": a.name, "model": a.model, "created_at": a.created_at}
            for a in recent_agents
        ],
        "recent_conversations": [
            {"id": c.id, "session_id": c.session_id, "created_at": c.created_at}
            for c in recent_conversations
        ]
    }
