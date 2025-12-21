"""Rotas de chat com agentes"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
import time
from datetime import datetime

from app.database import get_db
from app.models import Agent, Conversation, Message
from app.schemas import ChatRequest, ChatResponse
from app.services.llm import LLMService

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(
    chat_data: ChatRequest,
    db: Session = Depends(get_db)
):
    """Conversar com um agente"""
    
    # Buscar agente
    agent = db.query(Agent).filter(
        Agent.id == chat_data.agent_id,
        Agent.is_published == True,
        Agent.is_active == True
    ).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agente não encontrado ou não publicado"
        )
    
    # Obter ou criar conversa
    if chat_data.session_id:
        conversation = db.query(Conversation).filter(
            Conversation.session_id == chat_data.session_id
        ).first()
    else:
        conversation = None
    
    if not conversation:
        session_id = str(uuid.uuid4())
        conversation = Conversation(
            agent_id=agent.id,
            session_id=session_id,
            channel=chat_data.metadata.get("channel", "webchat"),
            user_identifier=chat_data.metadata.get("user_identifier"),
            metadata=chat_data.metadata
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Salvar mensagem do usuário
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=chat_data.message
    )
    db.add(user_message)
    db.commit()
    
    # Obter histórico de mensagens
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()
    
    # Preparar contexto
    chat_history = [
        {"role": msg.role, "content": msg.content}
        for msg in messages
    ]
    
    # Chamar LLM
    start_time = time.time()
    llm_service = LLMService(agent.model)
    
    try:
        response_text = await llm_service.generate(
            messages=chat_history,
            system_prompt=agent.system_prompt,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens
        )
        
        latency = time.time() - start_time
        
        # Salvar resposta do assistente
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response_text,
            model=agent.model,
            tokens_used=0,  # Calcular depois
            latency=latency
        )
        db.add(assistant_message)
        
        # Atualizar métricas do agente
        agent.total_messages += 2  # user + assistant
        
        db.commit()
        
        return ChatResponse(
            session_id=conversation.session_id,
            message=response_text,
            agent_name=agent.name,
            model=agent.model,
            tokens_used=0,
            latency=latency
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar mensagem: {str(e)}"
        )


@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Obter histórico de conversa"""
    conversation = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversa não encontrada"
        )
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.created_at).all()
    
    return {
        "session_id": session_id,
        "agent_id": conversation.agent_id,
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    }


@router.post("/end/{session_id}")
async def end_conversation(
    session_id: str,
    rating: int = None,
    feedback: str = None,
    db: Session = Depends(get_db)
):
    """Encerrar conversa"""
    conversation = db.query(Conversation).filter(
        Conversation.session_id == session_id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversa não encontrada"
        )
    
    conversation.is_active = False
    conversation.ended_at = datetime.utcnow()
    
    if rating:
        conversation.rating = rating
    if feedback:
        conversation.feedback = feedback
    
    db.commit()
    
    return {"message": "Conversa encerrada com sucesso"}
