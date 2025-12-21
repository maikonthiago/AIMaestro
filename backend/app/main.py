"""
AI-Maestro - Plataforma SaaS de Agentes de IA
Backend Principal - FastAPI
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import logging

from app.config import settings
from app.database import engine, Base
from app.api import auth, agents, chat, rag, analytics, workflows, skills

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerenciar ciclo de vida da aplicação"""
    # Startup
    logger.info("🚀 Iniciando AI-Maestro Backend...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tabelas do banco de dados criadas")
    yield
    # Shutdown
    logger.info("👋 Encerrando AI-Maestro Backend...")


app = FastAPI(
    title="AI-Maestro API",
    description="Plataforma SaaS para criação e gerenciamento de agentes de IA",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware para logging de requisições
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.2f}s"
    )
    return response


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "AI-Maestro"
    }


# Root
@app.get("/")
async def root():
    return {
        "message": "AI-Maestro API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


# Incluir rotas
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agentes"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])


# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Erro não tratado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Erro interno do servidor",
            "type": "internal_error"
        }
    )
