import './App.scss';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaFileArchive, FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

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
      <h1>Oráculo</h1>
      <h2>Seu assistente pessoal para gerenciar sua empresa</h2>
      <section className='chat-box'>
        <div className='container-messagens' ref={messageBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}
        </div>
  
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isSending}
          />
          <button type="submit" disabled={isSending}>
            <IoSend size={18} />
          </button>
        </form>
      </section>
  
      <button
        className='upload-open-modal'
        onClick={() => document.getElementById('file-upload').click()}
      >
        <FaFileArchive size={18} />
      </button>
      <input
        id="file-upload"
        type="file"
        accept='.txt' 
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

      <ul className='links-container'>
        <li>
          <a href="https://github.com/Yuriferr/Oraculo" target="_blank" rel="noopener noreferrer">
            <FaGithub size={16} style={{ marginRight: '8px' }} /> GitHub
          </a>
        </li>
        <li>
          <a href="mailto:yurifernandespreto@gmail.com">
            <FaEnvelope size={16} style={{ marginRight: '8px' }} /> Email
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/yuriferr/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={16} style={{ marginRight: '8px' }} /> LinkedIn
          </a>
        </li>
      </ul>
    </div>
  );
}