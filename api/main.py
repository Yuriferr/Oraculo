from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

# Criar a pasta de dados se não existir
DADOS_DIR = "dados"
os.makedirs(DADOS_DIR, exist_ok=True)

# Caminho padrão para o arquivo de dados
CAMINHO_ARQUIVO = os.path.join(DADOS_DIR, "dados_empresa.txt")

# Função para salvar o arquivo
def salvar_arquivo(file: UploadFile):
    # Verificar se o arquivo é .txt
    if not file.filename.endswith(".txt"):
        raise ValueError("Apenas arquivos .txt são permitidos.")

    # Salvar o arquivo (substitui o anterior)
    with open(CAMINHO_ARQUIVO, "wb") as buffer:
        buffer.write(file.file.read())

# Função para ler o arquivo
def ler_arquivo():
    if not os.path.exists(CAMINHO_ARQUIVO):
        raise FileNotFoundError("Nenhum arquivo de dados foi enviado ainda.")

    # Ler o conteúdo do arquivo
    with open(CAMINHO_ARQUIVO, "r") as f:
        conteudo = f.read()

    return conteudo

# Rota para upload do arquivo
@app.post("/upload-arquivo/")
async def upload_arquivo(file: UploadFile = File(...)):
    try:
        # Salvar o arquivo
        salvar_arquivo(file)
        return {"mensagem": "Arquivo enviado e salvo com sucesso!"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print("Erro ao processar o arquivo:", str(e))
        raise HTTPException(status_code=500, detail=f"Erro ao processar o arquivo: {str(e)}")

# Modelo de dados para a requisição do assistente
class PromptRequest(BaseModel):
    prompt: str

# Rota para interagir com o assistente virtual
@app.post("/assistente/")
async def assistente_virtual(request: PromptRequest):
    try:
        # Ler o conteúdo do arquivo
        dados_empresa = ler_arquivo()
        print("Dados da empresa:", dados_empresa)  # Log dos dados da empresa

        # Enviar os dados para a IA
        completion = client.chat.completions.create(
            extra_headers={
                "Authorization": f"Bearer {API_KEY}",  # Adicione a chave da API aqui
                "HTTP-Referer": "<YOUR_SITE_URL>",  # Opcional
                "X-Title": "<YOUR_SITE_NAME>",  # Opcional
            },
            extra_body={},
            model="deepseek/deepseek-r1:free",  # Ou outro modelo
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
                    "content": request.prompt
                }
            ]
        )

        # Retornar a resposta da IA
        return {"resposta": completion.choices[0].message.content}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print("Erro ao processar a requisição:", str(e))  # Log do erro
        raise HTTPException(status_code=500, detail=f"Erro ao processar a requisição: {str(e)}")

# Rota raiz para teste
@app.get("/")
async def root():
    return {"message": "API do Assistente Virtual está funcionando!"}