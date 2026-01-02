import { registerUser, isAuthenticated } from './auth.js'
import { ROUTES } from './config.js'
import { showAlert, clearAlert, toggleButtonLoading } from './ui.js'

document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    window.location.replace(ROUTES.app)
    return
  }

  const form = document.getElementById('register-form')
  const button = document.getElementById('register-btn')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    clearAlert('#alert-container')

    const fullName = document.getElementById('fullName').value.trim()
    const username = document.getElementById('username').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value.trim()
    const confirmPassword = document.getElementById('confirmPassword').value.trim()

    if (!fullName || !username || !email || !password || !confirmPassword) {
      showAlert('#alert-container', 'Preencha todos os campos obrigatórios', 'warning')
      return
    }

    if (password !== confirmPassword) {
      showAlert('#alert-container', 'As senhas não conferem', 'danger')
      return
    }

    if (password.length < 8) {
      showAlert('#alert-container', 'A senha deve ter pelo menos 8 caracteres', 'danger')
      return
    }

    toggleButtonLoading(button, true, 'Criar conta', 'Registrando...')

    const result = await registerUser({ email, username, password, fullName })

    toggleButtonLoading(button, false, 'Criar conta')

    if (!result.success) {
      showAlert('#alert-container', result.error, 'danger')
      return
    }

    showAlert('#alert-container', 'Conta criada com sucesso! Redirecionando...', 'success')
    setTimeout(() => window.location.replace(ROUTES.login), 1800)
  })
})
