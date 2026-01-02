import { initAppLayout } from './layout.js'
import { fetchWithAuth, logout } from './auth.js'
import { showAlert, formatDate, formatDateTime } from './ui.js'

const alertContainer = document.getElementById('alert-container')

const actions = [
  { key: 'activate', label: 'Ativar' },
  { key: 'deactivate', label: 'Desativar' },
  { key: 'upgrade-pro', label: 'Plano Pro' },
  { key: 'upgrade-business', label: 'Plano Business' },
  { key: 'delete', label: 'Excluir', danger: true }
]

document.addEventListener('DOMContentLoaded', async () => {
  const session = await initAppLayout('admin')
  if (!session?.user?.is_superadmin) {
    showAlert(alertContainer, 'Acesso restrito aos super administradores. Redirecionando...', 'warning')
    setTimeout(() => logout(), 2000)
    return
  }

  loadData()
})

async function loadData() {
  clearTables()
  try {
    const [stats, users, agents, tenants, activity] = await Promise.all([
      json('/admin/stats'),
      json('/admin/users?limit=50'),
      json('/admin/agents?limit=50'),
      json('/admin/tenants?limit=50'),
      json('/admin/recent-activity?limit=20'),
    ])

    renderStats(stats)
    renderUsers(users)
    renderAgents(agents)
    renderTenants(tenants)
    renderActivity(activity)
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger')
  }
}

async function json(path) {
  const response = await fetchWithAuth(path, { method: 'GET' })
  if (!response) throw new Error('Sessão inválida')
  if (!response.ok) throw new Error('Erro ao carregar dados')
  return response.json()
}

function renderStats(stats) {
  document.querySelector('[data-admin-stat="users"]').textContent = stats.users.total
  document.querySelector('[data-admin-substat="users"]').textContent = `${stats.users.active} ativos • ${stats.users.new_30d} novos (30d)`
  document.querySelector('[data-admin-stat="agents"]').textContent = stats.agents.total
  document.querySelector('[data-admin-stat="messages"]').textContent = stats.messages.total
  document.querySelector('[data-admin-stat="tenants"]').textContent = stats.tenants.total
}

function renderUsers(users) {
  const tbody = document.getElementById('users-body')
  users.forEach((user) => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username} ${user.is_superadmin ? '<span class="badge-soft purple ms-2">SUPER</span>' : ''}</td>
      <td>${user.email}</td>
      <td><span class="badge-soft purple">${user.plan}</span></td>
      <td><span class="badge-soft ${user.is_active ? 'green' : 'gray'}">${user.is_active ? 'Ativo' : 'Inativo'}</span></td>
      <td>
        ${user.is_superadmin ? '-' : renderActions(user.id, user.is_active)}
      </td>
    `
    tbody.appendChild(row)
  })
}

function renderActions(userId, isActive) {
  const menuId = `menu-${userId}`
  return `
    <div class="dropdown">
      <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Ações
      </button>
      <ul class="dropdown-menu" aria-labelledby="${menuId}">
        ${actions.map(action => {
          if (action.key === 'activate' && isActive) return ''
          if (action.key === 'deactivate' && !isActive) return ''
          const cls = action.danger ? 'text-danger' : ''
          return `<li><button class="dropdown-item ${cls}" data-action="${action.key}" data-user="${userId}">${action.label}</button></li>`
        }).join('')}
      </ul>
    </div>
  `
}

document.getElementById('users-body').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]')
  if (!button) return

  const userId = button.dataset.user
  const action = button.dataset.action

  if (action === 'delete' && !confirm('Deseja realmente deletar este usuário?')) {
    return
  }

  try {
    await triggerUserAction(userId, action)
    loadData()
  } catch (error) {
    showAlert(alertContainer, error.message, 'danger')
  }
})

async function triggerUserAction(userId, action) {
  let endpoint = ''
  let method = 'PATCH'
  switch (action) {
    case 'activate':
      endpoint = `/admin/users/${userId}/activate`
      break
    case 'deactivate':
      endpoint = `/admin/users/${userId}/deactivate`
      break
    case 'upgrade-pro':
      endpoint = `/admin/users/${userId}/plan?plan=pro`
      break
    case 'upgrade-business':
      endpoint = `/admin/users/${userId}/plan?plan=business`
      break
    case 'delete':
      endpoint = `/admin/users/${userId}`
      method = 'DELETE'
      break
    default:
      throw new Error('Ação inválida')
  }

  const response = await fetchWithAuth(endpoint, { method })
  if (!response || !response.ok) {
    throw new Error('Falha ao executar ação')
  }
}

function renderAgents(agents) {
  const tbody = document.getElementById('agents-body')
  agents.forEach((agent) => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${agent.id}</td>
      <td>${agent.name}</td>
      <td><span class="badge-soft purple">${agent.model}</span></td>
      <td>${agent.version ? 'v' + agent.version : '-'}</td>
      <td><span class="badge-soft ${agent.is_public ? 'green' : 'gray'}">${agent.is_public ? 'Sim' : 'Não'}</span></td>
      <td>${formatDate(agent.created_at)}</td>
    `
    tbody.appendChild(row)
  })
}

function renderTenants(tenants) {
  const tbody = document.getElementById('tenants-body')
  tenants.forEach((tenant) => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${tenant.id}</td>
      <td>${tenant.name}</td>
      <td>${tenant.slug}</td>
      <td><span class="badge-soft purple">${tenant.plan}</span></td>
      <td><span class="badge-soft ${tenant.is_active ? 'green' : 'gray'}">${tenant.is_active ? 'Ativo' : 'Inativo'}</span></td>
      <td>${formatDate(tenant.created_at)}</td>
    `
    tbody.appendChild(row)
  })
}

function renderActivity(activity) {
  const grid = document.getElementById('activity-grid')
  grid.innerHTML = ''

  if (activity?.recent_users?.length) {
    const column = document.createElement('div')
    column.className = 'col-md-4'
    column.innerHTML = `
      <div class="card-elevated p-4 h-100">
        <h5 class="mb-3">Usuários recentes</h5>
        ${activity.recent_users.slice(0, 5).map(user => `
          <div class="border-bottom py-2">
            <strong>${user.username}</strong>
            <div class="text-muted small">${user.email}</div>
            <small class="text-muted">${formatDateTime(user.created_at)}</small>
          </div>
        `).join('')}
      </div>
    `
    grid.appendChild(column)
  }

  if (activity?.recent_agents?.length) {
    const column = document.createElement('div')
    column.className = 'col-md-4'
    column.innerHTML = `
      <div class="card-elevated p-4 h-100">
        <h5 class="mb-3">Agentes recentes</h5>
        ${activity.recent_agents.slice(0, 5).map(agent => `
          <div class="border-bottom py-2">
            <strong>${agent.name}</strong>
            <div class="text-muted small">${agent.model}</div>
            <small class="text-muted">${formatDateTime(agent.created_at)}</small>
          </div>
        `).join('')}
      </div>
    `
    grid.appendChild(column)
  }

  if (activity?.recent_conversations?.length) {
    const column = document.createElement('div')
    column.className = 'col-md-4'
    column.innerHTML = `
      <div class="card-elevated p-4 h-100">
        <h5 class="mb-3">Conversas recentes</h5>
        ${activity.recent_conversations.slice(0, 5).map(conv => `
          <div class="border-bottom py-2">
            <strong>Sessão ${conv.session_id.slice(0, 8)}...</strong>
            <small class="text-muted d-block">${formatDateTime(conv.created_at)}</small>
          </div>
        `).join('')}
      </div>
    `
    grid.appendChild(column)
  }
}

function clearTables() {
  document.getElementById('users-body').innerHTML = ''
  document.getElementById('agents-body').innerHTML = ''
  document.getElementById('tenants-body').innerHTML = ''
  document.getElementById('activity-grid').innerHTML = ''
}
