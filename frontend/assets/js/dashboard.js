import { initAppLayout } from './layout.js'
import { fetchWithAuth } from './auth.js'
import { showAlert } from './ui.js'

document.addEventListener('DOMContentLoaded', async () => {
  await initAppLayout('dashboard')
  loadStats()
})

async function loadStats() {
  const alertContainer = document.createElement('div')
  alertContainer.id = 'stats-alert'
  const main = document.querySelector('.app-main')
  main?.prepend(alertContainer)

  try {
    const response = await fetchWithAuth('/analytics/dashboard', { method: 'GET' })
    if (!response) return

    if (!response.ok) {
      throw new Error('Erro ao carregar estatísticas')
    }

    const data = await response.json()
    document.querySelector('[data-stat="total_agents"]').textContent = data.total_agents ?? 0
    document.querySelector('[data-stat="total_conversations"]').textContent = data.total_conversations ?? 0
    document.querySelector('[data-stat="active_conversations"]').textContent = data.active_conversations ?? 0
    document.querySelector('[data-stat="total_messages"]').textContent = data.total_messages ?? 0
  } catch (error) {
    showAlert('#stats-alert', error.message, 'danger')
  }
}
