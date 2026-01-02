export function showAlert(container, message, type = 'danger') {
  const target = typeof container === 'string'
    ? document.querySelector(container)
    : container

  if (!target) return

  target.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `
}

export function clearAlert(container) {
  const target = typeof container === 'string'
    ? document.querySelector(container)
    : container

  if (target) target.innerHTML = ''
}

export function toggleButtonLoading(button, isLoading, text, loadingText) {
  if (!button) return

  if (isLoading) {
    button.dataset.originalText = button.textContent
    button.disabled = true
    button.innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ${loadingText || 'Processando...'}
    `
  } else {
    button.disabled = false
    button.textContent = text || button.dataset.originalText || 'Enviar'
  }
}

export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export function formatDateTime(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('pt-BR')
}

export function createBadge(text, style) {
  return `<span class="badge-soft ${style}">${text}</span>`
}
