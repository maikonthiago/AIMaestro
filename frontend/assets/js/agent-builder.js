import { initAppLayout } from './layout.js'
import { fetchWithAuth } from './auth.js'
import { showAlert, clearAlert, toggleButtonLoading } from './ui.js'
import { ROUTES } from './config.js'

const params = new URLSearchParams(window.location.search)
const agentId = params.get('id')

const form = document.getElementById('agent-form')
const alertContainer = document.getElementById('alert-container')
const pageTitle = document.getElementById('page-title')
const saveButton = document.getElementById('save-btn')

async function initPage() {
  await initAppLayout('agents')

  if (agentId) {
    pageTitle.textContent = 'Editar agente'
    loadAgent()
  }
}

document.addEventListener('DOMContentLoaded', initPage)

async function loadAgent() {
  try {
    const response = await fetchWithAuth(`/agents/${agentId}`, { method: 'GET' })
    if (!response) return

    if (!response.ok) {
      throw new Error('Não foi possível carregar o agente')
    }

    const agent = await response.json()
    Object.keys(agent).forEach((key) => {
      const input = form.elements.namedItem(key)
      if (!input) return
      if (input.type === 'select-one') {
        input.value = String(agent[key])
      } else {
        input.value = agent[key] ?? ''
      }
    })
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger')
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  clearAlert(alertContainer)

  const formData = new FormData(form)
  const payload = Object.fromEntries(formData.entries())

  payload.temperature = parseFloat(payload.temperature)
  payload.max_tokens = parseInt(payload.max_tokens, 10)
  payload.temperature = Number.isNaN(payload.temperature) ? 0.7 : payload.temperature
  payload.max_tokens = Number.isNaN(payload.max_tokens) ? 1000 : payload.max_tokens
  payload.is_published = payload.is_published === 'true'

  toggleButtonLoading(saveButton, true, 'Salvar agente', agentId ? 'Atualizando...' : 'Criando...')

  try {
    const response = await fetchWithAuth(agentId ? `/agents/${agentId}` : '/agents/', {
      method: agentId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    })

    if (!response) return

    if (!response.ok) {
      throw new Error('Falha ao salvar agente')
    }

    window.location.replace(ROUTES.agents)
  } catch (error) {
    toggleButtonLoading(saveButton, false, 'Salvar agente')
    showAlert(alertContainer, error.message, 'danger')
  }
})
