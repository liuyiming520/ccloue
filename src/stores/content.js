import { reactive } from 'vue'
import LocalStorage from './hybrid-storage'

const state = reactive({
  content: {},
  products: [],
  news: [],
  isLoading: false,
  storageStatus: LocalStorage.getStorageStatus()
})

// 初始化数据
const initializeData = () => {
  state.isLoading = true
  
  try {
    state.content = LocalStorage.getData('site_content') || {}
    state.products = LocalStorage.getData('site_products') || []
    state.news = LocalStorage.getData('site_news') || []
  } catch (error) {
    console.error('数据初始化失败:', error)
  } finally {
    state.isLoading = false
  }
}

// 初始化数据
initializeData()

export const useContentStore = () => {
  const updateContent = (section, data) => {
    state.content[section] = { ...state.content[section], ...data }
    LocalStorage.saveData('site_content', state.content)
  }
  
  const addProduct = (product) => {
    product.id = Date.now()
    state.products.push(product)
    LocalStorage.saveData('site_products', state.products)
  }
  
  const updateProduct = (id, data) => {
    const index = state.products.findIndex(p => p.id === id)
    if (index !== -1) {
      state.products[index] = { ...state.products[index], ...data }
      LocalStorage.saveData('site_products', state.products)
    }
  }
  
  const deleteProduct = (id) => {
    const index = state.products.findIndex(p => p.id === id)
    if (index !== -1) {
      state.products.splice(index, 1)
      LocalStorage.saveData('site_products', state.products)
    }
  }
  
  const addNews = (news) => {
    news.id = Date.now()
    news.createTime = new Date().toISOString()
    state.news.unshift(news)
    LocalStorage.saveData('site_news', state.news)
  }
  
  const updateNews = (id, data) => {
    const index = state.news.findIndex(n => n.id === id)
    if (index !== -1) {
      state.news[index] = { ...state.news[index], ...data }
      LocalStorage.saveData('site_news', state.news)
    }
  }
  
  const deleteNews = (id) => {
    const index = state.news.findIndex(n => n.id === id)
    if (index !== -1) {
      state.news.splice(index, 1)
      LocalStorage.saveData('site_news', state.news)
    }
  }

  // 数据管理
  const clearAllData = () => {
    LocalStorage.clearAll()
    initializeData()
  }
  
  return {
    content: state.content,
    products: state.products,
    news: state.news,
    isLoading: state.isLoading,
    storageStatus: state.storageStatus,
    updateContent,
    addProduct,
    updateProduct,
    deleteProduct,
    addNews,
    updateNews,
    deleteNews,
    clearAllData
  }
}