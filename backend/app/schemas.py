"""Schemas Pydantic para validação de dados"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    plan: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


# Agent Schemas
class AgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    model: str = "gpt-4"
    temperature: float = Field(0.7, ge=0, le=2)
    max_tokens: int = Field(1000, ge=1, le=4000)


class AgentCreate(AgentBase):
    personality: Optional[Dict[str, Any]] = {}
    system_prompt: Optional[str] = None
    skills: Optional[List[str]] = []
    actions: Optional[List[Dict[str, Any]]] = []
    guardrails: Optional[Dict[str, Any]] = {}


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    personality: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    system_prompt: Optional[str] = None
    skills: Optional[List[str]] = None
    actions: Optional[List[Dict[str, Any]]] = None
    guardrails: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    is_published: Optional[bool] = None


class AgentResponse(AgentBase):
    id: int
    owner_id: int
    personality: Dict[str, Any]
    system_prompt: Optional[str]
    skills: List[str]
    is_active: bool
    is_published: bool
    version: int
    total_conversations: int
    total_messages: int
    avg_rating: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    agent_id: int
    message: str
    session_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}


class ChatResponse(BaseModel):
    session_id: str
    message: str
    agent_name: str
    model: str
    tokens_used: int
    latency: float


# Knowledge Base Schemas
class KnowledgeBaseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    chunk_size: int = Field(1000, ge=100, le=4000)
    chunk_overlap: int = Field(200, ge=0, le=1000)


class KnowledgeBaseResponse(BaseModel):
    id: int
    agent_id: int
    name: str
    description: Optional[str]
    is_active: bool
    total_documents: int
    total_chunks: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    is_processed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Workflow Schemas
class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    triggers: List[Dict[str, Any]] = []


class WorkflowResponse(BaseModel):
    id: int
    agent_id: int
    name: str
    description: Optional[str]
    is_active: bool
    version: int
    total_executions: int
    success_rate: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Analytics Schemas
class AgentAnalytics(BaseModel):
    total_conversations: int
    total_messages: int
    avg_rating: float
    active_conversations: int
    messages_by_day: List[Dict[str, Any]]
    top_topics: List[Dict[str, Any]]
    avg_response_time: float
    success_rate: float


class ConversationStats(BaseModel):
    total: int
    active: int
    completed: int
    avg_duration: float
    by_channel: Dict[str, int]


# Skill Schemas
class SkillResponse(BaseModel):
    id: int
    name: str
    display_name: str
    description: Optional[str]
    category: str
    is_premium: bool
    rating: float
    usage_count: int
    
    class Config:
        from_attributes = True
