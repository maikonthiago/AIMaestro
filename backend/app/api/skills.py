"""Rotas de skills (marketplace)"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Skill
from app.schemas import SkillResponse

router = APIRouter()


@router.get("/", response_model=List[SkillResponse])
async def list_skills(
    category: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Listar skills disponíveis"""
    
    query = db.query(Skill).filter(Skill.is_active == True)
    
    if category:
        query = query.filter(Skill.category == category)
    
    skills = query.offset(skip).limit(limit).all()
    
    return skills


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: int,
    db: Session = Depends(get_db)
):
    """Obter skill por ID"""
    
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.is_active == True
    ).first()
    
    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill não encontrada"
        )
    
    return skill


@router.get("/categories/list")
async def list_categories(db: Session = Depends(get_db)):
    """Listar categorias de skills"""
    
    categories = db.query(Skill.category).distinct().all()
    
    return {
        "categories": [cat[0] for cat in categories if cat[0]]
    }
