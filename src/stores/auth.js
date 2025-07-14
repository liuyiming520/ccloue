import { reactive, computed } from 'vue'

const state = reactive({
  token: localStorage.getItem('admin_token'),
  user: JSON.parse(localStorage.getItem('admin_user') || 'null')
})

export const useAuthStore = () => {
  const isAuthenticated = computed(() => !!state.token)
  
  const login = (credentials) => {
    // 简单的本地验证，实际项目中应该调用API
    const validCredentials = {
      username: 'admin',
      password: 'admin123'
    }
    
    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      const token = 'fake-jwt-token-' + Date.now()
      const user = { 
        id: 1, 
        username: credentials.username,
        role: 'admin'
      }
      
      state.token = token
      state.user = user
      
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(user))
      
      return { success: true }
    }
    
    return { success: false, message: '用户名或密码错误' }
  }
  
  const logout = () => {
    state.token = null
    state.user = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }
  
  return {
    isAuthenticated,
    user: computed(() => state.user),
    login,
    logout
  }
}