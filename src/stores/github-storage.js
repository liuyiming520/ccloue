// GitHub作为数据库的存储方案
import axios from 'axios'

const GITHUB_CONFIG = {
  owner: 'liuyiming520', // 你的GitHub用户名
  repo: 'company-website-data', // 建议创建专门的数据仓库
  token: 'your-github-token', // 需要你自己生成GitHub Token
  branch: 'main'
}

class GitHubStorage {
  constructor() {
    this.baseURL = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents`
    this.headers = {
      'Authorization': `token ${GITHUB_CONFIG.token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  }

  // 获取文件内容
  async getFile(path) {
    try {
      const response = await axios.get(`${this.baseURL}/${path}`, {
        headers: this.headers
      })
      
      const content = JSON.parse(atob(response.data.content))
      return { content, sha: response.data.sha }
    } catch (error) {
      if (error.response?.status === 404) {
        return { content: null, sha: null }
      }
      throw error
    }
  }

  // 保存文件内容
  async saveFile(path, content, sha = null) {
    try {
      const data = {
        message: `Update ${path}`,
        content: btoa(JSON.stringify(content, null, 2)),
        branch: GITHUB_CONFIG.branch
      }
      
      if (sha) {
        data.sha = sha
      }
      
      const response = await axios.put(`${this.baseURL}/${path}`, data, {
        headers: this.headers
      })
      
      return response.data
    } catch (error) {
      console.error('GitHub save error:', error)
      throw error
    }
  }

  // 获取网站内容
  async getContent() {
    const result = await this.getFile('data/content.json')
    return result.content || {
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
  }

  // 获取产品列表
  async getProducts() {
    const result = await this.getFile('data/products.json')
    return result.content || []
  }

  // 获取新闻列表
  async getNews() {
    const result = await this.getFile('data/news.json')
    return result.content || []
  }

  // 获取留言列表
  async getMessages() {
    const result = await this.getFile('data/messages.json')
    return result.content || []
  }

  // 保存网站内容
  async saveContent(content) {
    const result = await this.getFile('data/content.json')
    return await this.saveFile('data/content.json', content, result.sha)
  }

  // 保存产品列表
  async saveProducts(products) {
    const result = await this.getFile('data/products.json')
    return await this.saveFile('data/products.json', products, result.sha)
  }

  // 保存新闻列表
  async saveNews(news) {
    const result = await this.getFile('data/news.json')
    return await this.saveFile('data/news.json', news, result.sha)
  }

  // 保存留言列表
  async saveMessages(messages) {
    const result = await this.getFile('data/messages.json')
    return await this.saveFile('data/messages.json', messages, result.sha)
  }
}

export default new GitHubStorage()