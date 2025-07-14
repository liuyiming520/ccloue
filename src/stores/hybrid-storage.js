// 混合存储管理器：本地存储 + 云端备份
import GitHubStorage from './github-storage'

const STORAGE_CONFIG = {
  useCloud: false, // 是否启用云存储
  autoSync: true,  // 是否自动同步
  syncInterval: 30000 // 同步间隔30秒
}

class HybridStorage {
  constructor() {
    this.isOnline = navigator.onLine
    this.syncTimer = null
    this.listeners = new Set()
    
    // 监听网络状态
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners('online')
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners('offline')
    })
  }

  // 添加状态监听器
  addListener(callback) {
    this.listeners.add(callback)
  }

  // 移除状态监听器
  removeListener(callback) {
    this.listeners.delete(callback)
  }

  // 通知监听器
  notifyListeners(event) {
    this.listeners.forEach(callback => callback(event))
  }

  // 启用云存储
  enableCloud() {
    STORAGE_CONFIG.useCloud = true
    if (STORAGE_CONFIG.autoSync) {
      this.startAutoSync()
    }
  }

  // 禁用云存储
  disableCloud() {
    STORAGE_CONFIG.useCloud = false
    this.stopAutoSync()
  }

  // 开始自动同步
  startAutoSync() {
    if (this.syncTimer) return
    
    this.syncTimer = setInterval(() => {
      if (this.isOnline && STORAGE_CONFIG.useCloud) {
        this.syncToCloud()
      }
    }, STORAGE_CONFIG.syncInterval)
  }

  // 停止自动同步
  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  // 获取数据（优先本地，备选云端）
  async getData(key) {
    try {
      // 优先从本地获取
      const localData = localStorage.getItem(key)
      if (localData) {
        return JSON.parse(localData)
      }

      // 如果启用云存储且在线，从云端获取
      if (STORAGE_CONFIG.useCloud && this.isOnline) {
        let cloudData = null
        
        switch (key) {
          case 'site_content':
            cloudData = await GitHubStorage.getContent()
            break
          case 'site_products':
            cloudData = await GitHubStorage.getProducts()
            break
          case 'site_news':
            cloudData = await GitHubStorage.getNews()
            break
          case 'contact_messages':
            cloudData = await GitHubStorage.getMessages()
            break
        }
        
        if (cloudData) {
          // 保存到本地缓存
          localStorage.setItem(key, JSON.stringify(cloudData))
          return cloudData
        }
      }

      return null
    } catch (error) {
      console.error('获取数据失败:', error)
      return null
    }
  }

  // 保存数据（本地+云端）
  async saveData(key, data) {
    try {
      // 保存到本地
      localStorage.setItem(key, JSON.stringify(data))
      
      // 如果启用云存储且在线，保存到云端
      if (STORAGE_CONFIG.useCloud && this.isOnline) {
        await this.saveToCloud(key, data)
      }
      
      return true
    } catch (error) {
      console.error('保存数据失败:', error)
      return false
    }
  }

  // 保存到云端
  async saveToCloud(key, data) {
    try {
      switch (key) {
        case 'site_content':
          await GitHubStorage.saveContent(data)
          break
        case 'site_products':
          await GitHubStorage.saveProducts(data)
          break
        case 'site_news':
          await GitHubStorage.saveNews(data)
          break
        case 'contact_messages':
          await GitHubStorage.saveMessages(data)
          break
      }
      
      this.notifyListeners('sync_success')
    } catch (error) {
      console.error('云端保存失败:', error)
      this.notifyListeners('sync_error')
    }
  }

  // 手动同步到云端
  async syncToCloud() {
    if (!STORAGE_CONFIG.useCloud || !this.isOnline) {
      return false
    }

    try {
      const keys = ['site_content', 'site_products', 'site_news', 'contact_messages']
      
      for (const key of keys) {
        const localData = localStorage.getItem(key)
        if (localData) {
          await this.saveToCloud(key, JSON.parse(localData))
        }
      }
      
      this.notifyListeners('sync_complete')
      return true
    } catch (error) {
      console.error('同步失败:', error)
      this.notifyListeners('sync_error')
      return false
    }
  }

  // 从云端同步到本地
  async syncFromCloud() {
    if (!STORAGE_CONFIG.useCloud || !this.isOnline) {
      return false
    }

    try {
      const keys = [
        { local: 'site_content', method: 'getContent' },
        { local: 'site_products', method: 'getProducts' },
        { local: 'site_news', method: 'getNews' },
        { local: 'contact_messages', method: 'getMessages' }
      ]

      for (const { local, method } of keys) {
        const cloudData = await GitHubStorage[method]()
        if (cloudData) {
          localStorage.setItem(local, JSON.stringify(cloudData))
        }
      }

      this.notifyListeners('sync_complete')
      return true
    } catch (error) {
      console.error('从云端同步失败:', error)
      this.notifyListeners('sync_error')
      return false
    }
  }

  // 获取存储状态
  getStorageStatus() {
    return {
      isOnline: this.isOnline,
      useCloud: STORAGE_CONFIG.useCloud,
      autoSync: STORAGE_CONFIG.autoSync,
      syncInterval: STORAGE_CONFIG.syncInterval
    }
  }
}

export default new HybridStorage()