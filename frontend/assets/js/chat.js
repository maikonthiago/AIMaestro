import { initAppLayout } from './layout.js'
import { fetchWithAuth } from './auth.js'
import { showAlert, clearAlert } from './ui.js'

const params = new URLSearchParams(window.location.search)
const agentId = params.get('agentId')
const messagesElement = document.getElementById('messages')
const alertContainer = document.getElementById('alert-container')
const sendButton = document.getElementById('send-btn')
const messageInput = document.getElementById('message-input')
let sessionId = null

function escapeHTML(value) {
  const div = document.createElement('div')
  div.textContent = value ?? ''
  return div.innerHTML
}

if (!agentId) {
  showAlert(alertContainer, 'Agente não informado. Volte e selecione um agente.', 'warning')
}

document.addEventListener('DOMContentLoaded', async () => {
  await initAppLayout('agents')
  if (agentId) {
    loadAgent()
  }
})

async function loadAgent() {
  try {
    const response = await fetchWithAuth(`/agents/${agentId}`, { method: 'GET' })
    if (!response) return
    if (!response.ok) throw new Error('Erro ao carregar agente')
    const agent = await response.json()
    document.getElementById('agent-name').textContent = `Conversando com ${agent.name}`
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger')
  }
}

sendButton.addEventListener('click', () => {
  sendMessage()
})

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
})

async function sendMessage() {
  const content = messageInput.value.trim()
  if (!content || !agentId) return

  appendMessage(content, 'user')
  messageInput.value = ''
  sendButton.disabled = true

  try {
    const response = await fetchWithAuth('/chat/', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: parseInt(agentId, 10),
        message: content,
        session_id: sessionId
      })
    })

    if (!response) return
    if (!response.ok) throw new Error('Erro ao enviar mensagem')

    const data = await response.json()
    sessionId = sessionId || data.session_id
    appendMessage(data.message, 'assistant')
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger')
  } finally {
    sendButton.disabled = false
  }
}

function appendMessage(text, role = 'assistant') {
  clearAlert(alertContainer)
  const wrapper = document.createElement('div')
  wrapper.className = `message-bubble ${role === 'user' ? 'user' : 'assistant'}`
  const safeText = escapeHTML(text).replace(/\n/g, '<br>')
  wrapper.innerHTML = `<p class="mb-0">${safeText}</p>`
  messagesElement.appendChild(wrapper)
  messagesElement.scrollTop = messagesElement.scrollHeight
}
