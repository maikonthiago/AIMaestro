import { initAppLayout } from './layout.js'
import { fetchWithAuth } from './auth.js'
import { showAlert, clearAlert } from './ui.js'
import { ROUTES } from './config.js'

document.addEventListener('DOMContentLoaded', async () => {
  await initAppLayout('agents')
  loadAgents()
})

async function loadAgents() {
  const container = document.getElementById('agents-grid')
  const emptyState = document.getElementById('agents-empty')
  clearAlert('#alert-container')

  container.innerHTML = ''

  try {
    const response = await fetchWithAuth('/agents/', { method: 'GET' })
    if (!response) return

    if (!response.ok) {
      throw new Error('Erro ao carregar agentes')
    }

    const agents = await response.json()

    if (!agents.length) {
      emptyState.classList.remove('d-none')
      return
    }

    emptyState.classList.add('d-none')

    agents.forEach((agent) => {
      const template = document.getElementById('agent-card-template')
      const node = template.content.cloneNode(true)
      node.querySelector('[data-field="name"]').textContent = agent.name
      node.querySelector('[data-field="model"]').textContent = `Modelo ${agent.model}`
      node.querySelector('[data-field="description"]').textContent = agent.description || 'Sem descrição'

      const status = node.querySelector('[data-field="status"]')
      status.textContent = agent.is_published ? 'Publicado' : 'Rascunho'
      status.classList.add(agent.is_published ? 'green' : 'gray')

      node.querySelector('[data-action="chat"]').addEventListener('click', () => {
        window.location.href = `${ROUTES.chat}?agentId=${agent.id}`
      })

      node.querySelector('[data-action="edit"]').addEventListener('click', () => {
        window.location.href = `${ROUTES.builder}?id=${agent.id}`
      })

      node.querySelector('[data-action="delete"]').addEventListener('click', () => {
        handleDelete(agent.id)
      })

      container.appendChild(node)
    })
  } catch (error) {
    showAlert('#alert-container', error.message, 'danger')
  }
}

async function handleDelete(id) {
  if (!confirm('Deseja realmente deletar este agente?')) return

  try {
    const response = await fetchWithAuth(`/agents/${id}`, { method: 'DELETE' })
    if (!response) return

    if (!response.ok) {
      throw new Error('Erro ao deletar agente')
    }
    loadAgents()
  } catch (error) {
    showAlert('#alert-container', error.message, 'danger')
  }
}
