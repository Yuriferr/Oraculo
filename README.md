# Oráculo - Assistente Virtual para Consulta de Dados Empresariais 🚀

O **Oráculo** é um assistente virtual desenvolvido para revolucionar a forma como você interage com os dados da sua empresa. Com uma interface simples e poderosa, ele permite que você envie arquivos de texto com informações empresariais e faça perguntas para obter respostas rápidas e precisas, tudo isso utilizando IA.

---

## 💡 Funcionalidades

- **Consulta de Dados**: Envie um arquivo de texto com os dados da sua empresa e faça perguntas.
- **Respostas Inteligentes**: Utiliza modelos de linguagem avançados para fornecer respostas claras e objetivas.
- **Interface Intuitiva**: Fácil de usar, com uma interface moderna e responsiva.
- **Código Aberto**: Totalmente aberto para colaboração, aprendizado e personalização.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js (interface moderna e responsiva).
- **Backend**: FastAPI (rápido, leve e escalável).
- **IA**: Integração com modelos de linguagem avançados (OpenRouter.ai).
- **Gerenciamento de Estado**: React Hooks (`useState`, `useEffect`).
- **Estilização**: CSS puro para um design limpo e profissional.

---

## 📦 Como Rodar o Projeto Localmente

### Pré-requisitos

- **Node.js** (v16 ou superior) para o frontend.
- **Python** (v3.8 ou superior) para o backend.
- **Git** para clonar o repositório.

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/oraculo.git
   cd oraculo
   ```

2. **Configure o backend**:
   - Acesse a pasta do backend:
     ```bash
     cd api
     ```
   - Crie um ambiente virtual e instale as dependências:
     ```bash
     python -m venv venv
     source venv/bin/activate  # No Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - Configure a chave da API (OpenRouter.ai):
     - Crie um arquivo `.env` na pasta `api` e adicione:
       ```plaintext
       API_KEY=sua_chave_aqui
       ```
   - Inicie o servidor:
     ```bash
     uvicorn main:app --reload
     ```

3. **Configure o frontend**:
   - Acesse a pasta do frontend:
     ```bash
     cd ../web
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o servidor de desenvolvimento:
     ```bash
     npm start
     ```

4. **Acesse o projeto**:
   - Abra o navegador e acesse:
     ```
     http://localhost:3000
     ```

---

## 🚀 Como Usar

1. **Envie um arquivo de texto**:
   - Na seção de upload, envie um arquivo `.txt` com os dados da sua empresa.
   - Exemplo de arquivo:
     ```plaintext
     Nome da Empresa: PixelForge Studios
     Fundação: 2015
     Funcionários: 120
     Jogos Lançados: Shadow Realms, Cyber Nexus, Eclipse Warriors
     ```

2. **Faça perguntas**:
   - No campo de texto, digite sua pergunta (ex: \"Quantos funcionários a empresa tem?\").
   - O Oráculo responderá com base nos dados enviados.

---

## 📂 Estrutura do Projeto

```
oraculo/
├── api/                   # Código do backend (FastAPI)
│   ├── main.py            # Roteamento e lógica da API
│   ├── requirements.txt   # Dependências do Python
│   └── .env               # Variáveis de ambiente
├── web/                   # Código do frontend (React)
│   ├── public/            # Arquivos estáticos
│   ├── src/               # Código-fonte do React
│   │   ├── App.js         # Componente principal
│   │   ├── App.css        # Estilos do componente principal
│   │   └── index.js       # Ponto de entrada do React
│   └── package.json       # Dependências do Node.js
└── README.md              # Este arquivo
```

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um **fork** do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m \"Adicionei uma nova funcionalidade\"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request** e descreva suas alterações.

---

## 📌 Roadmap

- [x] Primeira versão funcional.
- [ ] Integração com banco de dados.
- [ ] Suporte a múltiplos arquivos.
- [ ] Melhorias na interface do usuário.
- [ ] Adicionar autenticação de usuários.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

Se você é líder de tecnologia ou representa uma empresa e se interessou pelo projeto, fique à vontade para entrar em contato! Estou aberto a parcerias, colaborações ou contratações para levar o Oráculo ao próximo nível.

- **LinkedIn**: [Yuri Fernandes](https://www.linkedin.com/in/yuriferr)
- **E-mail**: yurifernandespreto@gmail.com

---

Feito com ❤️ por [Yuriferr](https://github.com/Yuriferr).  
