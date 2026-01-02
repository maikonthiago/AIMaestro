
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Subscription, PaymentHistory
from app.config import settings
import stripe
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

# Configurar Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@router.post("/create-checkout-session")
async def create_checkout_session(
    plan_type: str,  # pro, business
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cria uma sessão de checkout no Stripe"""
    
    # Mapear planos para price_ids (Configurar no .env depois ou aqui)
    prices = {
        "pro": "price_H5ggYJD8q9812s",  # SUBSTITUIR POR ID REAL
        "business": "price_H5ggYJD8q9812x"   # SUBSTITUIR POR ID REAL
    }
    
    if plan_type not in prices:
        raise HTTPException(status_code=400, detail="Plano inválido")
        
    try:
        # Verificar se usuário já tem customer_id
        subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
        customer_id = subscription.stripe_customer_id if subscription else None
        
        # Criar sessão
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            client_reference_id=str(current_user.id),
            payment_method_types=['card'],
            line_items=[{
                'price': prices[plan_type],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{settings.FRONTEND_URL}/app/settings?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/app/settings?canceled=true",
            customer_email=current_user.email if not customer_id else None
        )
        
        return {"url": checkout_session.url}
        
    except Exception as e:
        logger.error(f"Erro no Stripe: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """Recebe eventos do Stripe"""
    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="Webhook Error")
        
    # Processar evento
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_checkout_completed(session)
        
    elif event['type'] == 'invoice.payment_succeeded':
        # Atualizar status da assinatura
        pass
        
    return {"status": "success"}

async def handle_checkout_completed(session):
    """Processa checkout concluído com sucesso"""
    # Lógica para criar/atualizar Subscription no DB
    # Precisa usar Session local pois webhook não tem Depends(get_db)
    pass

@router.get("/portal")
async def customer_portal(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Redireciona para o portal de clientes Stripe"""
    subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    if not subscription or not subscription.stripe_customer_id:
        raise HTTPException(status_code=400, detail="Sem assinatura ativa")
        
    portal_session = stripe.billing_portal.Session.create(
        customer=subscription.stripe_customer_id,
        return_url=f"{settings.FRONTEND_URL}/app/settings"
    )
    
    return {"url": portal_session.url}
