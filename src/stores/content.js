import { reactive } from 'vue'
import HybridStorage from './hybrid-storage'

const defaultContent = {
  home: {
    title: '欢迎来到我们公司',
    subtitle: '专业的解决方案提供商',
    description: '我们致力于为客户提供优质的产品和服务',
    features: [
      { title: '专业团队', description: '拥有多年行业经验的专业团队' },
      { title: '优质服务', description: '7x24小时贴心服务' },
      { title: '创新技术', description: '采用最新的技术解决方案' }
    ]
  },
  about: {
    title: '关于我们',
    description: '公司成立于2020年，是一家专注于技术创新的现代化企业...',
    mission: '致力于通过技术创新改善人们的生活',
    vision: '成为行业领先的技术解决方案提供商',
    values: ['诚信', '创新', '专业', '共赢']
  },
  contact: {
    address: '北京市朝阳区某某大厦',
    phone: '010-12345678',
    email: 'contact@company.com',
    workTime: '周一至周五 9:00-18:00'
  }
}

const state = reactive({
  content: defaultContent,
  products: [],
  news: [],
  isLoading: false,
  storageStatus: HybridStorage.getStorageStatus()
})

// 初始化数据
const initializeData = async () => {
  state.isLoading = true
  
  try {
    const [content, products, news] = await Promise.all([
      HybridStorage.getData('site_content'),
      HybridStorage.getData('site_products'),
      HybridStorage.getData('site_news')
    ])
    
    state.content = content || defaultContent
    state.products = products || []
    state.news = news || []
  } catch (error) {
    console.error('数据初始化失败:', error)
  } finally {
    state.isLoading = false
  }
}

// 监听存储状态变化
HybridStorage.addListener((event) => {
  state.storageStatus = HybridStorage.getStorageStatus()
  
  if (event === 'online') {
    console.log('网络已连接，可以同步数据')
  } else if (event === 'offline') {
    console.log('网络已断开，将使用本地数据')
  }
})

// 初始化数据
initializeData()

export const useContentStore = () => {
  const updateContent = async (section, data) => {
    state.content[section] = { ...state.content[section], ...data }
    await HybridStorage.saveData('site_content', state.content)
  }
  
  const addProduct = async (product) => {
    product.id = Date.now()
    state.products.push(product)
    await HybridStorage.saveData('site_products', state.products)
  }
  
  const updateProduct = async (id, data) => {
    const index = state.products.findIndex(p => p.id === id)
    if (index !== -1) {
      state.products[index] = { ...state.products[index], ...data }
      await HybridStorage.saveData('site_products', state.products)
    }
  }
  
  const deleteProduct = async (id) => {
    const index = state.products.findIndex(p => p.id === id)
    if (index !== -1) {
      state.products.splice(index, 1)
      await HybridStorage.saveData('site_products', state.products)
    }
  }
  
  const addNews = async (news) => {
    news.id = Date.now()
    news.createTime = new Date().toISOString()
    state.news.unshift(news)
    await HybridStorage.saveData('site_news', state.news)
  }
  
  const updateNews = async (id, data) => {
    const index = state.news.findIndex(n => n.id === id)
    if (index !== -1) {
      state.news[index] = { ...state.news[index], ...data }
      await HybridStorage.saveData('site_news', state.news)
    }
  }
  
  const deleteNews = async (id) => {
    const index = state.news.findIndex(n => n.id === id)
    if (index !== -1) {
      state.news.splice(index, 1)
      await HybridStorage.saveData('site_news', state.news)
    }
  }

  // 云存储管理
  const enableCloudStorage = () => {
    HybridStorage.enableCloud()
    state.storageStatus = HybridStorage.getStorageStatus()
  }

  const disableCloudStorage = () => {
    HybridStorage.disableCloud()
    state.storageStatus = HybridStorage.getStorageStatus()
  }

  const syncToCloud = async () => {
    return await HybridStorage.syncToCloud()
  }

  const syncFromCloud = async () => {
    const success = await HybridStorage.syncFromCloud()
    if (success) {
      // 重新加载数据
      await initializeData()
    }
    return success
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
    enableCloudStorage,
    disableCloudStorage,
    syncToCloud,
    syncFromCloud
  }
}