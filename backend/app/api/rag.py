"""Rotas de RAG (Retrieval Augmented Generation)"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid

from app.database import get_db
from app.models import User, Agent, KnowledgeBase, Document
from app.schemas import KnowledgeBaseCreate, KnowledgeBaseResponse, DocumentUploadResponse
from app.auth import get_current_user
from app.config import settings
from app.services.rag import RAGService

router = APIRouter()


@router.post("/knowledge-bases", response_model=KnowledgeBaseResponse, status_code=status.HTTP_201_CREATED)
async def create_knowledge_base(
    kb_data: KnowledgeBaseCreate,
    agent_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Criar base de conhecimento para um agente"""
    
    # Verificar se agente existe e pertence ao usuário
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agente não encontrado"
        )
    
    # Criar knowledge base
    kb = KnowledgeBase(
        agent_id=agent_id,
        name=kb_data.name,
        description=kb_data.description,
        chunk_size=kb_data.chunk_size,
        chunk_overlap=kb_data.chunk_overlap
    )
    
    db.add(kb)
    db.commit()
    db.refresh(kb)
    
    return kb


@router.get("/knowledge-bases", response_model=List[KnowledgeBaseResponse])
async def list_knowledge_bases(
    agent_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar bases de conhecimento de um agente"""
    
    # Verificar se agente pertence ao usuário
    agent = db.query(Agent).filter(
        Agent.id == agent_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agente não encontrado"
        )
    
    knowledge_bases = db.query(KnowledgeBase).filter(
        KnowledgeBase.agent_id == agent_id
    ).all()
    
    return knowledge_bases


@router.post("/knowledge-bases/{kb_id}/documents", response_model=DocumentUploadResponse)
async def upload_document(
    kb_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload de documento para a base de conhecimento"""
    
    # Verificar se KB existe e pertence ao usuário
    kb = db.query(KnowledgeBase).join(Agent).filter(
        KnowledgeBase.id == kb_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not kb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Base de conhecimento não encontrada"
        )
    
    # Validar tipo de arquivo
    allowed_extensions = ['.pdf', '.txt', '.docx', '.md']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de arquivo não suportado. Tipos permitidos: {', '.join(allowed_extensions)}"
        )
    
    # Salvar arquivo
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(file_path, "wb") as f:
        content = await file.read()
        
        # Verificar tamanho
        if len(content) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Arquivo muito grande. Tamanho máximo: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
        
        f.write(content)
    
    # Criar documento
    document = Document(
        knowledge_base_id=kb_id,
        filename=file.filename,
        file_path=file_path,
        file_type=file_ext[1:],  # Remover o ponto
        file_size=len(content)
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Processar documento em background (aqui simulado)
    try:
        rag_service = RAGService()
        chunks = await rag_service.process_document(
            file_path,
            kb.chunk_size,
            kb.chunk_overlap
        )
        
        document.is_processed = True
        document.chunks_count = len(chunks)
        kb.total_documents += 1
        kb.total_chunks += len(chunks)
        
        db.commit()
        db.refresh(document)
        
    except Exception as e:
        document.processing_error = str(e)
        db.commit()
    
    return document


@router.get("/knowledge-bases/{kb_id}/documents")
async def list_documents(
    kb_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Listar documentos de uma base de conhecimento"""
    
    # Verificar se KB pertence ao usuário
    kb = db.query(KnowledgeBase).join(Agent).filter(
        KnowledgeBase.id == kb_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not kb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Base de conhecimento não encontrada"
        )
    
    documents = db.query(Document).filter(
        Document.knowledge_base_id == kb_id
    ).all()
    
    return documents


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletar documento"""
    
    # Verificar se documento pertence ao usuário
    document = db.query(Document).join(KnowledgeBase).join(Agent).filter(
        Document.id == document_id,
        Agent.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documento não encontrado"
        )
    
    # Deletar arquivo físico
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.delete(document)
    db.commit()
    
    return None


@router.post("/search")
async def search_knowledge(
    query: str,
    kb_id: int,
    top_k: int = 5,
    db: Session = Depends(get_db)
):
    """Buscar informação na base de conhecimento"""
    
    kb = db.query(KnowledgeBase).filter(KnowledgeBase.id == kb_id).first()
    
    if not kb:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Base de conhecimento não encontrada"
        )
    
    # Buscar documentos relevantes
    rag_service = RAGService()
    results = await rag_service.search(query, kb_id, top_k)
    
    return {
        "query": query,
        "results": results
    }
