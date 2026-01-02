
from fastapi import APIRouter, Request, HTTPException, Query, BackgroundTasks
import logging
import httpx
from app.config import settings
from app.services.llm import LLMService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/whatsapp/webhook")
async def verify_whatsapp_webhook(
    mode: str = Query(None, alias="hub.mode"),
    token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """Verificação do Webhook do Messenger/WhatsApp"""
    if mode and token:
        if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
            logger.info("Webhook verificado com sucesso!")
            return int(challenge)
        else:
            raise HTTPException(status_code=403, detail="Token de verificação inválido")
    
    raise HTTPException(status_code=400, detail="Parâmetros inválidos")

@router.post("/whatsapp/webhook")
async def receive_whatsapp_message(request: Request, background_tasks: BackgroundTasks):
    """Recebe mensagens do WhatsApp"""
    payload = await request.json()
    
    # Processar em background para responder rápido ao webhook (evitar timeout)
    background_tasks.add_task(process_whatsapp_payload, payload)
    
    return {"status": "success"}

async def process_whatsapp_payload(payload):
    """Processa o payload do WhatsApp e responde"""
    try:
        entries = payload.get('entry', [])
        for entry in entries:
            changes = entry.get('changes', [])
            for change in changes:
                value = change.get('value', {})
                messages = value.get('messages', [])
                
                if not messages:
                    continue
                
                # Pegar ID do telefone par responder
                # Nota: Em produção, você usaria o phone_number_id para saber qual Agente usar
                phone_number_id = value.get('metadata', {}).get('phone_number_id')
                
                for message in messages:
                    if message.get('type') != 'text':
                        continue
                        
                    sender_id = message.get('from')
                    text_body = message.get('text', {}).get('body')
                    
                    logger.info(f"Mensagem de {sender_id}: {text_body}")
                    
                    # Gerar resposta com LLM
                    llm = LLMService(model="gpt-4") # Ou pegar do user config
                    
                    try:
                        reply_text = await llm.generate(
                            messages=[{"role": "user", "content": text_body}],
                            system_prompt="Você é um assistente útil e amigável atendendo via WhatsApp."
                        )
                    except Exception as llm_error:
                        logger.error(f"Erro LLM: {llm_error}")
                        reply_text = "Desculpe, estou com dificuldades para pensar agora."

                    # Enviar resposta
                    await send_whatsapp_message(phone_number_id, sender_id, reply_text)
                    
    except Exception as e:
        logger.error(f"Erro ao processar mensagem WA: {str(e)}")

async def send_whatsapp_message(phone_number_id, recipient_id, text):
    """Envia mensagem de texto via WhatsApp Cloud API"""
    if not settings.WHATSAPP_TOKEN:
        logger.warning("Token do WhatsApp não configurado. Não foi possível responder.")
        return

    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": recipient_id,
        "type": "text",
        "text": {"body": text}
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=data, headers=headers)
            response.raise_for_status()
            logger.info(f"Resposta enviada para {recipient_id}")
        except Exception as e:
            logger.error(f"Erro ao enviar mensagem WA: {str(e)}")
