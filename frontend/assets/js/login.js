import { isAuthenticated, login } from './auth.js'
import { ROUTES } from './config.js'
import { showAlert, clearAlert, toggleButtonLoading } from './ui.js'

document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    window.location.replace(ROUTES.app)
    return
  }

  const form = document.getElementById('login-form')
  const button = document.getElementById('login-btn')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    clearAlert('#alert-container')

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()

    if (!email || !password) {
      showAlert('#alert-container', 'Preencha todos os campos', 'warning')
      return
    }

    toggleButtonLoading(button, true, 'Entrar', 'Entrando...')

    const result = await login(email, password)
    toggleButtonLoading(button, false, 'Entrar')

    if (!result.success) {
      showAlert('#alert-container', result.error, 'danger')
      return
    }

    window.location.replace(ROUTES.app)
  })
})
