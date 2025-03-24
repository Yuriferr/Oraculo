import './App.scss';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [prompt, setPrompt] = useState(''); // Estado para armazenar a mensagem do usuário
  const [file, setFile] = useState(null); // Estado para armazenar o arquivo
  const [messages, setMessages] = useState([]); // Estado para armazenar o histórico de mensagens
  const [isUploading, setIsUploading] = useState(false); // Estado para indicar carregamento do upload
  const [isSending, setIsSending] = useState(false); // Estado para indicar carregamento do envio da mensagem
  const [uploadStatus, setUploadStatus] = useState(''); // Estado para feedback do upload
  const messageBoxRef = useRef(null); // Referência para a caixa de mensagens

  // Efeito para rolar automaticamente para a última mensagem
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Função para lidar com o envio do arquivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".txt")) {
      setFile(file); // Armazenar o arquivo
      setUploadStatus('');
    } else {
      setUploadStatus("Apenas arquivos .txt são permitidos.");
      setFile(null); // Limpar o arquivo selecionado
    }
  };

  // Função para enviar o arquivo para a API
  const handleUploadFile = async () => {
    if (!file) return; // Não enviar se não houver arquivo

    setIsUploading(true); // Ativar o indicador de carregamento do upload
    setUploadStatus(''); // Limpar o feedback anterior

    try {
      const formData = new FormData();
      formData.append('file', file); // Adicionar o arquivo ao FormData

      // Enviar o arquivo para a API
      const response = await axios.post('http://127.0.0.1:8000/upload-arquivo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Definir o tipo de conteúdo como multipart/form-data
        },
      });

      setUploadStatus(response.data.mensagem); // Feedback do upload
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      setUploadStatus('Erro ao enviar o arquivo. Tente novamente.');
    } finally {
      setIsUploading(false); // Desativar o indicador de carregamento do upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir o comportamento padrão do formulário
    if (!prompt.trim()) return; // Não enviar mensagens vazias

    setIsSending(true); // Ativar o indicador de carregamento do envio da mensagem

    try {
      // Adicionar a mensagem do usuário ao histórico
      const userMessage = { sender: 'user', text: prompt };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Enviar a mensagem para a API
      const response = await axios.post('http://127.0.0.1:8000/assistente/', {
        prompt: prompt,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Adicionar a resposta da IA ao histórico
      const aiMessage = { sender: 'ai', text: response.data.resposta };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      // Adicionar uma mensagem de erro ao histórico
      const errorMessage = { sender: 'ai', text: 'Desculpe, ocorreu um erro. Tente novamente.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false); // Desativar o indicador de carregamento do envio da mensagem
      setPrompt(''); // Limpar o campo de entrada
    }
  };

  return (
    <div className='App'>
      <section className='app-box'>
        <h1>Oráculo</h1>

        <div className='icon-box'>
          <img src="/cat.png" alt="cat" />
        </div>

        {/* Formulário para envio de arquivos */}
        <form onSubmit={(e) => { e.preventDefault(); handleUploadFile(); }} className='file-form'>
          <h3>Envio de Arquivo</h3>
          <div>
            <input type="file" accept=".txt" onChange={handleFileUpload} />
            <button type="submit" disabled={isUploading}>
              {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
            </button>
          </div>
          {uploadStatus && <p>{uploadStatus}</p>}
        </form>

        {/* Formulário para envio de mensagens */}
        <form onSubmit={handleSubmit} className='message-form'>
          <h3>Envio de Mensagens</h3>
          <div className="message-box" ref={messageBoxRef}>
            {messages.map((message, index) => (
              <div key={index} className={message.sender}>
                <strong>{message.sender === 'user' ? 'Você' : 'IA'}:</strong>
                {message.sender === 'ai' ? (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite sua mensagem"
          />
          <button type="submit" disabled={isSending}>
            {isSending ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </section>
    </div>
  );
}