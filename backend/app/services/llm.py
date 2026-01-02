"""Serviço de LLM (Large Language Models)"""

from typing import List, Dict, Any, Optional
import openai
import anthropic
import google.generativeai as genai
from app.config import settings


class LLMService:
    """Serviço para interagir com diferentes LLMs"""
    
    def __init__(self, model: str = "gpt-4"):
        self.model = model
        
        # Configurar clientes
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = anthropic.Anthropic(
                api_key=settings.ANTHROPIC_API_KEY
            )
            
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
    
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """Gerar resposta do LLM"""
        
        if self.model.startswith("gpt"):
            return await self._generate_openai(
                messages, system_prompt, temperature, max_tokens
            )
        elif self.model.startswith("claude"):
            return await self._generate_anthropic(
                messages, system_prompt, temperature, max_tokens
            )
        elif self.model.startswith("gemini"):
            return await self._generate_google(
                messages, system_prompt, temperature, max_tokens
            )
        else:
            raise ValueError(f"Modelo não suportado: {self.model}")
    
    async def _generate_openai(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> str:
        """Gerar resposta usando OpenAI"""
        
        if not settings.OPENAI_API_KEY:
            return "⚠️ API Key da OpenAI não configurada. Por favor, configure OPENAI_API_KEY no arquivo .env"
        
        try:
            # Preparar mensagens
            chat_messages = []
            
            if system_prompt:
                chat_messages.append({"role": "system", "content": system_prompt})
            
            chat_messages.extend(messages)
            
            # Chamar API
            response = openai.chat.completions.create(
                model=self.model,
                messages=chat_messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            return f"Erro ao gerar resposta: {str(e)}"
    
    async def _generate_anthropic(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> str:
        """Gerar resposta usando Anthropic Claude"""
        
        if not settings.ANTHROPIC_API_KEY:
            return "⚠️ API Key da Anthropic não configurada. Por favor, configure ANTHROPIC_API_KEY no arquivo .env"
        
        try:
            # Preparar mensagens (Claude não usa system no array de mensagens)
            formatted_messages = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in messages
                if msg["role"] != "system"
            ]
            
            # Chamar API
            response = self.anthropic_client.messages.create(
                model=self.model,
                system=system_prompt or "",
                messages=formatted_messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            return response.content[0].text
        
        except Exception as e:
            return f"Erro ao gerar resposta: {str(e)}"
    
    async def _generate_google(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str],
        temperature: float,
        max_tokens: int
    ) -> str:
        """Gerar resposta usando Google Gemini"""
        
        if not settings.GOOGLE_API_KEY:
            return "⚠️ API Key do Google não configurada. Por favor, configure GOOGLE_API_KEY no arquivo .env"
        
        try:
            # Selecionar modelo
            model_name = "gemini-pro"
            if "vision" in self.model:
                model_name = "gemini-pro-vision"
                
            model = genai.GenerativeModel(model_name)
            
            # Preparar prompt
            # Gemini tem estrutura diferente, vamos simplificar concatenando
            full_prompt = ""
            if system_prompt:
                full_prompt += f"System: {system_prompt}\n\n"
            
            for msg in messages:
                role = msg["role"]
                content = msg["content"]
                if role == "user":
                    full_prompt += f"User: {content}\n"
                elif role == "assistant":
                    full_prompt += f"Assistant: {content}\n"
            
            # Configuração
            generation_config = genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens
            )
            
            # Gerar
            response = model.generate_content(
                full_prompt,
                generation_config=generation_config
            )
            
            return response.text
        
        except Exception as e:
            return f"Erro ao gerar resposta: {str(e)}"
    
    def estimate_tokens(self, text: str) -> int:
        """Estimar número de tokens"""
        # Aproximação: ~4 caracteres por token
        return len(text) // 4
    
    def estimate_cost(self, tokens: int) -> float:
        """Estimar custo em USD"""
        # Preços aproximados (atualizar conforme necessário)
        prices = {
            "gpt-4": {"input": 0.03 / 1000, "output": 0.06 / 1000},
            "gpt-3.5-turbo": {"input": 0.0015 / 1000, "output": 0.002 / 1000},
            "claude-3-opus": {"input": 0.015 / 1000, "output": 0.075 / 1000},
            "claude-3-sonnet": {"input": 0.003 / 1000, "output": 0.015 / 1000},
        }
        
        model_price = prices.get(self.model, prices["gpt-3.5-turbo"])
        
        # Assumindo metade input, metade output
        return (tokens / 2 * model_price["input"]) + (tokens / 2 * model_price["output"])
