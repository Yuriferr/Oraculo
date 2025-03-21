from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel  # Importe o BaseModel do Pydantic
from openai import OpenAI
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente
load_dotenv()

# Configurar o cliente OpenAI (OpenRouter)
API_KEY = os.getenv("API_KEY")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

# Dados fictícios da empresa
dados_empresa = [
    {"produto": "Cadeira", "vendas": 150, "estoque": 20},
    {"produto": "Mesa", "vendas": 100, "estoque": 15},
    {"produto": "Sofá", "vendas": 50, "estoque": 5},
    {"produto": "Armário", "vendas": 75, "estoque": 10},
]

# Definir o modelo de dados esperado
class PromptRequest(BaseModel):
    prompt: str

# Inicializar o FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens (não recomendado para produção)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os headers
)

# Rota para interagir com o assistente virtual
@app.post("/assistente/")
async def assistente_virtual(request: PromptRequest):  # Use o modelo Pydantic aqui
    try:
        # Enviar os dados para a IA
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "<YOUR_SITE_URL>",  # Opcional
                "X-Title": "<YOUR_SITE_NAME>",  # Opcional
            },
            extra_body={},
            model="deepseek/deepseek-r1-distill-llama-70b:free",
            messages=[
                {
                    "role": "system",
                    "content": f"""
                    Você é um assistente virtual que ajuda a administrar uma empresa com base nos dados fornecidos. 
                    DADOS:
                    {dados_empresa}

                    FORMATO DE SAIDA DA RESPOSTA:
                    clara e objetiva
                    """
                },
                {
                    "role": "user",
                    "content": request.prompt  # Use request.prompt para acessar o prompt
                }
            ]
        )

        # Retornar a resposta da IA
        return {"resposta": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar a requisição: {str(e)}")

# Rota raiz para teste
@app.get("/")
async def root():
    return {"message": "API do Assistente Virtual está funcionando!"}