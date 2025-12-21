"""Rotas de analytics"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, Agent, Conversation, Message
from app.schemas import AgentAnalytics, ConversationStats
from app.auth import get_current_user

router = APIRouter()


@router.get("/agents/{agent_id}", response_model=AgentAnalytics)
async def get_agent_analytics(
    agent_id: int,
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter analytics de um agente"""
    
    # Verificar se agente pertence ao usuário
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agente não encontrado")
    
    # Data de início
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Métricas básicas
    total_conversations = db.query(Conversation).filter(
        Conversation.agent_id == agent_id
    ).count()
    
    active_conversations = db.query(Conversation).filter(
        Conversation.agent_id == agent_id,
        Conversation.is_active == True
    ).count()
    
    total_messages = db.query(Message).join(Conversation).filter(
        Conversation.agent_id == agent_id
    ).count()
    
    # Rating médio
    avg_rating = db.query(func.avg(Conversation.rating)).filter(
        Conversation.agent_id == agent_id,
        Conversation.rating.isnot(None)
    ).scalar() or 0.0
    
    # Mensagens por dia
    messages_by_day = db.query(
        func.date(Message.created_at).label('date'),
        func.count(Message.id).label('count')
    ).join(Conversation).filter(
        Conversation.agent_id == agent_id,
        Message.created_at >= start_date
    ).group_by(func.date(Message.created_at)).all()
    
    # Tempo médio de resposta
    avg_response_time = db.query(func.avg(Message.latency)).filter(
        Message.conversation_id.in_(
            db.query(Conversation.id).filter(Conversation.agent_id == agent_id)
        ),
        Message.role == 'assistant'
    ).scalar() or 0.0
    
    return AgentAnalytics(
        total_conversations=total_conversations,
        total_messages=total_messages,
        avg_rating=round(avg_rating, 2),
        active_conversations=active_conversations,
        messages_by_day=[
            {"date": str(row.date), "count": row.count}
            for row in messages_by_day
        ],
        top_topics=[],  # Implementar análise de tópicos
        avg_response_time=round(avg_response_time, 2),
        success_rate=85.5  # Implementar cálculo real
    )


@router.get("/conversations/stats", response_model=ConversationStats)
async def get_conversation_stats(
    agent_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter estatísticas de conversas"""
    
    query = db.query(Conversation).join(Agent).filter(
        Agent.owner_id == current_user.id
    )
    
    if agent_id:
        query = query.filter(Conversation.agent_id == agent_id)
    
    total = query.count()
    active = query.filter(Conversation.is_active == True).count()
    completed = query.filter(
        Conversation.is_active == False,
        Conversation.ended_at.isnot(None)
    ).count()
    
    # Conversas por canal
    by_channel = db.query(
        Conversation.channel,
        func.count(Conversation.id)
    ).join(Agent).filter(
        Agent.owner_id == current_user.id
    ).group_by(Conversation.channel).all()
    
    return ConversationStats(
        total=total,
        active=active,
        completed=completed,
        avg_duration=0.0,  # Implementar cálculo
        by_channel={row[0]: row[1] for row in by_channel}
    )


@router.get("/dashboard")
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obter dados do dashboard principal"""
    
    # Total de agentes
    total_agents = db.query(Agent).filter(
        Agent.owner_id == current_user.id
    ).count()
    
    # Total de conversas
    total_conversations = db.query(Conversation).join(Agent).filter(
        Agent.owner_id == current_user.id
    ).count()
    
    # Total de mensagens
    total_messages = db.query(Message).join(Conversation).join(Agent).filter(
        Agent.owner_id == current_user.id
    ).count()
    
    # Conversas ativas
    active_conversations = db.query(Conversation).join(Agent).filter(
        Agent.owner_id == current_user.id,
        Conversation.is_active == True
    ).count()
    
    return {
        "total_agents": total_agents,
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "active_conversations": active_conversations,
        "plan": current_user.plan
    }
