import { ensureUserSession, logout } from './auth.js'
import { ROUTES } from './config.js'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', href: ROUTES.app },
  { id: 'agents', label: 'Agentes', icon: 'bi-people', href: ROUTES.agents },
  { id: 'analytics', label: 'Analytics', icon: 'bi-bar-chart', href: ROUTES.analytics },
  { id: 'settings', label: 'Configurações', icon: 'bi-gear', href: ROUTES.settings },
]

export async function initAppLayout(activeId) {
  const session = await ensureUserSession()
  if (!session) return null

  const sidebar = document.getElementById('sidebar')
  const header = document.getElementById('app-header')

  if (sidebar) {
    sidebar.innerHTML = `
      <div class="app-sidebar">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <div class="brand">AI Maestro</div>
            <small class="text-muted">${session.user?.plan || 'Starter'}</small>
          </div>
          <button class="btn btn-sm btn-outline-secondary d-lg-none" id="toggle-nav">
            <i class="bi bi-list"></i>
          </button>
        </div>
        <nav class="app-nav" id="sidebar-nav">
          ${NAV_ITEMS.map(item => `
            <a class="sidebar-link ${activeId === item.id ? 'active' : ''}" href="${item.href}">
              <i class="bi ${item.icon}"></i>
              <span>${item.label}</span>
            </a>
          `).join('')}
          ${session.user?.is_superadmin ? `
            <a class="sidebar-link ${activeId === 'admin' ? 'active' : ''}" href="${ROUTES.admin}">
              <i class="bi bi-shield-lock"></i>
              <span>Admin Panel</span>
            </a>
          ` : ''}
        </nav>
      </div>
    `

    const toggleButton = document.getElementById('toggle-nav')
    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        document.getElementById('sidebar-nav')?.classList.toggle('d-none')
      })
    }
  }

  if (header) {
    header.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary d-lg-none" id="open-sidebar">
          <i class="bi bi-list"></i>
        </button>
        <div>
          <h5 class="mb-0">Bem-vindo, ${session.user?.full_name || session.user?.username}</h5>
          <small class="text-muted">Plano ${session.user?.plan || 'Starter'}</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-light position-relative">
          <i class="bi bi-bell"></i>
        </button>
        <div class="dropdown">
          <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
            <i class="bi bi-person-circle me-2"></i>
            ${session.user?.username}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="${ROUTES.settings}">Configurações</a></li>
            <li><button class="dropdown-item" id="logout-btn">Sair</button></li>
          </ul>
        </div>
      </div>
    `

    document.getElementById('open-sidebar')?.addEventListener('click', () => {
      document.querySelector('.app-sidebar')?.classList.toggle('d-none')
    })
  }

  document.getElementById('logout-btn')?.addEventListener('click', logout)

  return session
}
