// 本地存储管理器
class LocalStorage {
  constructor() {
    // 初始化默认数据
    this.initDefaultData()
  }

  // 初始化默认数据
  initDefaultData() {
    const defaultData = {
      site_content: {
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
      },
      site_products: [],
      site_news: [],
      contact_messages: []
    }

    // 如果本地没有数据，则设置默认值
    Object.keys(defaultData).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultData[key]))
      }
    })
  }

  // 获取数据
  getData(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('获取数据失败:', error)
      return null
    }
  }

  // 保存数据
  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('保存数据失败:', error)
      return false
    }
  }

  // 删除数据
  deleteData(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('删除数据失败:', error)
      return false
    }
  }

  // 清空所有数据
  clearAll() {
    try {
      const keys = ['site_content', 'site_products', 'site_news', 'contact_messages']
      keys.forEach(key => localStorage.removeItem(key))
      this.initDefaultData()
      return true
    } catch (error) {
      console.error('清空数据失败:', error)
      return false
    }
  }

  // 获取存储状态
  getStorageStatus() {
    return {
      storageType: 'local',
      isAvailable: typeof Storage !== 'undefined'
    }
  }
}

export default new LocalStorage()