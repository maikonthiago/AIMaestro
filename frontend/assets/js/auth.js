import { API_URL, ROUTES } from './config.js'

const STORAGE_KEY = 'aim-auth'

function parseStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Erro ao ler sessão', err)
    return null
  }
}

export function getSession() {
  return parseStoredSession()
}

export function setSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated() {
  const session = getSession()
  return Boolean(session?.token)
}

export async function ensureUserSession() {
  const session = getSession()
  if (!session?.token) {
    redirectToLogin()
    return null
  }

  if (!session.user) {
    try {
      const user = await fetchCurrentUser(session.token)
      const updated = { ...session, user }
      setSession(updated)
      return updated
    } catch (error) {
      redirectToLogin()
      return null
    }
  }

  return session
}

export async function login(email, password) {
  try {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))
      return { success: false, error: detail.detail || 'Credenciais inválidas' }
    }

    const data = await response.json()
    const token = data.access_token
    const user = await fetchCurrentUser(token)

    setSession({ token, user })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erro ao conectar com o servidor' }
  }
}

export async function registerUser({ email, username, password, fullName }) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password,
        full_name: fullName
      })
    })

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}))
      return { success: false, error: detail.detail || 'Erro ao registrar' }
    }

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Erro ao conectar com o servidor' }
  }
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Sessão expirada')
  }

  return response.json()
}

export function redirectToLogin() {
  clearSession()
  window.location.replace(ROUTES.login)
}

export function logout() {
  clearSession()
  window.location.replace(ROUTES.login)
}

export async function fetchWithAuth(path, options = {}) {
  const session = getSession()
  if (!session?.token) {
    redirectToLogin()
    return null
  }

  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData) && !headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('Authorization', `Bearer ${session.token}`)

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  })

  if (response.status === 401) {
    redirectToLogin()
    return null
  }

  return response
}

export function appendAuthToHeaders(headers = {}) {
  const session = getSession()
  if (!session?.token) return headers
  return {
    ...headers,
    Authorization: `Bearer ${session.token}`
  }
}
