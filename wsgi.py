"""
WSGI config for AI-Maestro on PythonAnywhere

Deploy: https://www.pythonanywhere.com/user/lobtechsolutions/
Domain: https://www.lobtechsolutions.com.br/
"""

import sys
import os

# Adicionar o projeto ao path
project_home = '/home/lobtechsolutions/AIMaestro/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Carregar variáveis de ambiente
from dotenv import load_dotenv
env_path = os.path.join(project_home, '.env')
load_dotenv(env_path)

# Importar a aplicação FastAPI
from app.main import app as application

# Para debugging (remover em produção)
# import logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# logger.info(f"Python path: {sys.path}")
# logger.info(f"Environment loaded from: {env_path}")
