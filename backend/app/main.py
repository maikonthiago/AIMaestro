"""
AI-Maestro - Plataforma SaaS de Agentes de IA
Backend Principal - FastAPI
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import time
import logging
from pathlib import Path

from app.config import settings
from app.database import engine, Base
from app.api import auth, agents, chat, rag, analytics, workflows, skills, admin, billing, integrations

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


FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"


def frontend_page(*path_parts: str) -> FileResponse:
    file_path = FRONTEND_DIR.joinpath(*path_parts)
    if not file_path.is_file():
        logger.warning("Arquivo de front-end não encontrado: %s", file_path)
        raise HTTPException(status_code=404, detail="Página não encontrada")
    return FileResponse(file_path)


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
@app.get("/", include_in_schema=False)
async def serve_landing():
    return frontend_page("index.html")


@app.get("/login", include_in_schema=False)
@app.get("/login/", include_in_schema=False)
async def serve_login():
    return frontend_page("login", "index.html")


@app.get("/register", include_in_schema=False)
@app.get("/register/", include_in_schema=False)
async def serve_register():
    return frontend_page("register", "index.html")


def _serve_app_page(*relative_path: str):
    return frontend_page("app", *relative_path, "index.html")


@app.get("/app", include_in_schema=False)
@app.get("/app/", include_in_schema=False)
async def app_dashboard():
    return _serve_app_page()


@app.get("/app/agents", include_in_schema=False)
@app.get("/app/agents/", include_in_schema=False)
async def app_agents():
    return _serve_app_page("agents")


@app.get("/app/agent-builder", include_in_schema=False)
@app.get("/app/agent-builder/", include_in_schema=False)
async def app_agent_builder():
    return _serve_app_page("agent-builder")


@app.get("/app/chat", include_in_schema=False)
@app.get("/app/chat/", include_in_schema=False)
async def app_chat():
    return _serve_app_page("chat")


@app.get("/app/analytics", include_in_schema=False)
@app.get("/app/analytics/", include_in_schema=False)
async def app_analytics():
    return _serve_app_page("analytics")


@app.get("/app/settings", include_in_schema=False)
@app.get("/app/settings/", include_in_schema=False)
async def app_settings():
    return _serve_app_page("settings")


@app.get("/app/admin", include_in_schema=False)
@app.get("/app/admin/", include_in_schema=False)
async def app_admin():
    return _serve_app_page("admin")


# Incluir rotas
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agentes"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflows"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(admin.router, prefix="/api", tags=["Administração"])
app.include_router(billing.router, prefix="/api/billing", tags=["Faturamento"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrações"])


if FRONTEND_DIR.exists():
    assets_dir = FRONTEND_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
else:
    logger.warning("Diretório do frontend não encontrado em %s", FRONTEND_DIR)


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
