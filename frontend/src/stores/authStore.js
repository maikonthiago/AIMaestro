import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = '/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const formData = new FormData()
          formData.append('username', email) // FastAPI OAuth2 usa 'username'
          formData.append('password', password)

          const response = await axios.post(`${API_URL}/auth/login`, formData)
          
          const { access_token } = response.data
          
          // Configurar axios com token
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
          
          // Buscar dados do usuário
          const userResponse = await axios.get(`${API_URL}/auth/me`)
          
          set({
            token: access_token,
            user: userResponse.data,
            isAuthenticated: true
          })
          
          return { success: true }
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.detail || 'Erro ao fazer login'
          }
        }
      },

      register: async (email, username, password, fullName) => {
        try {
          await axios.post(`${API_URL}/auth/register`, {
            email,
            username,
            password,
            full_name: fullName
          })
          
          return { success: true }
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.detail || 'Erro ao registrar'
          }
        }
      },

      logout: () => {
        delete axios.defaults.headers.common['Authorization']
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      // Restaurar sessão
      restoreSession: () => {
        const { token } = get()
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      }
    }
  )
)
