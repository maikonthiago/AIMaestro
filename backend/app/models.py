"""Modelos do banco de dados"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    """Usuário do sistema"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_superadmin = Column(Boolean, default=False)  # Super administrador do sistema
    plan = Column(String, default="starter")  # starter, pro, business, enterprise
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    tenants = relationship("Tenant", back_populates="owner")
    agents = relationship("Agent", back_populates="owner")


class Tenant(Base):
    """Tenant (organização) para multi-tenancy"""
    __tablename__ = "tenants"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String, default="starter")
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    owner = relationship("User", back_populates="tenants")
    agents = relationship("Agent", back_populates="tenant")


class Agent(Base):
    """Agente de IA"""
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    
    # Configurações do agente
    personality = Column(JSON, default={})  # tom, estilo, limites
    model = Column(String, default="gpt-4")  # gpt-4, claude-3, gemini-pro
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=1000)
    system_prompt = Column(Text)
    
    # Capacidades
    skills = Column(JSON, default=[])  # lista de skills habilitadas
    actions = Column(JSON, default=[])  # ações que pode executar
    guardrails = Column(JSON, default={})  # limites e regras
    
    # Status
    is_active = Column(Boolean, default=True)
    is_published = Column(Boolean, default=False)
    version = Column(Integer, default=1)
    
    # Métricas
    total_conversations = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    owner = relationship("User", back_populates="agents")
    tenant = relationship("Tenant", back_populates="agents")
    conversations = relationship("Conversation", back_populates="agent")
    knowledge_bases = relationship("KnowledgeBase", back_populates="agent")


class Conversation(Base):
    """Conversa com o agente"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    session_id = Column(String, unique=True, index=True, nullable=False)
    
    # Informações da conversa
    channel = Column(String, default="webchat")  # webchat, whatsapp, telegram, api
    user_identifier = Column(String)  # phone, email, user_id
    metadata = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    ended_at = Column(DateTime)
    rating = Column(Integer)  # 1-5
    feedback = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    agent = relationship("Agent", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    """Mensagem em uma conversa"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    
    # Conteúdo
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    
    # Metadados
    model = Column(String)
    tokens_used = Column(Integer, default=0)
    cost = Column(Float, default=0.0)
    latency = Column(Float)  # em segundos
    metadata = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    conversation = relationship("Conversation", back_populates="messages")


class KnowledgeBase(Base):
    """Base de conhecimento (RAG)"""
    __tablename__ = "knowledge_bases"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Configurações
    embedding_model = Column(String, default="text-embedding-ada-002")
    chunk_size = Column(Integer, default=1000)
    chunk_overlap = Column(Integer, default=200)
    
    # Status
    is_active = Column(Boolean, default=True)
    total_documents = Column(Integer, default=0)
    total_chunks = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    agent = relationship("Agent", back_populates="knowledge_bases")
    documents = relationship("Document", back_populates="knowledge_base")


class Document(Base):
    """Documento na base de conhecimento"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    knowledge_base_id = Column(Integer, ForeignKey("knowledge_bases.id"), nullable=False)
    
    # Informações do documento
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String)  # pdf, docx, txt
    file_size = Column(Integer)  # em bytes
    
    # Processamento
    is_processed = Column(Boolean, default=False)
    chunks_count = Column(Integer, default=0)
    processing_error = Column(Text)
    
    # Metadados
    metadata = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)
    
    # Relacionamentos
    knowledge_base = relationship("KnowledgeBase", back_populates="documents")


class Workflow(Base):
    """Workflow (automação)"""
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    
    # Definição do workflow
    nodes = Column(JSON, default=[])  # nós do workflow
    edges = Column(JSON, default=[])  # conexões
    triggers = Column(JSON, default=[])  # gatilhos
    
    # Status
    is_active = Column(Boolean, default=True)
    version = Column(Integer, default=1)
    
    # Métricas
    total_executions = Column(Integer, default=0)
    success_rate = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Skill(Base):
    """Skill (capacidade do agente)"""
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)  # communication, data, integration, etc
    
    # Configuração
    code = Column(Text)  # código da skill
    parameters = Column(JSON, default=[])
    returns = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    
    # Métricas
    usage_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ApiKey(Base):
    """Chaves de API para integração"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    key = Column(String, unique=True, index=True, nullable=False)
    
    # Configurações
    is_active = Column(Boolean, default=True)
    rate_limit = Column(Integer, default=1000)  # requisições por hora
    scopes = Column(JSON, default=[])  # permissões
    
    # Métricas
    total_requests = Column(Integer, default=0)
    last_used_at = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
