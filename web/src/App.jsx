import './App.css'
import axios from 'axios'
import { useState } from 'react'

export default function App() {
  const [prompt, setPrompt] = useState('') // Estado para armazenar a mensagem do usuário

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevenir o comportamento padrão do formulário
    try {
      const response = await axios.post('http://127.0.0.1:8000/assistente/', {
        prompt: prompt
      }, {
        headers: {
          'Content-Type': 'application/json' // Garantir que o cabeçalho está correto
        }
      })
      console.log('Resposta da IA:', response.data.resposta) // Exibir a resposta no console
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error)
    }
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Assistente Virtual</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Digite sua mensagem"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Atualizar o estado com o valor do input
          />
          <button type="submit">Enviar</button>
        </form>
      </header>
    </div>
  )
}